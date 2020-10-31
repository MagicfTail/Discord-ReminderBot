import * as config from "./config.json";
import { BOT_TOKEN } from "./token.json";
import * as Discord from "discord.js";
import * as fs from "fs";
import { commandList } from "./Commands";
import SRManager from "./StoredReminderManager";
import Repeating from "./Reminders/Repeating";
import Single from "./Reminders/Single";

const prefix = config.PREFIX;

const client = new Discord.Client();
client.login(BOT_TOKEN);

setInterval(() => {
    checkReminder();
}, 1000);

//dump when the app is closed
process.on("exit", dumpSR);

//catches ctrl+c event
process.on("SIGINT", exitHandler);

// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", exitHandler);
process.on("SIGUSR2", exitHandler);

//catches uncaught exceptions
process.on("uncaughtException", exitHandler);

function exitHandler() {
    process.exit();
}

function dumpSR() {
    fs.writeFileSync(
        "./data/StoredReminderData.json",
        JSON.stringify(SRManager.getDateReminders())
    );

    console.log("Dumped StoredReminders");
}

function commandReceived(message: Discord.Message, success: boolean) {
    if (success) {
        message.react("✅");
    } else {
        message.react("❎");
    }
}

function isEmpty(obj: Object): boolean {
    return Object.keys(obj).length == 0;
}

function deleteElement(array: (Single | Repeating)[], key: Single | Repeating) {
    const index = array.indexOf(key, 0);
    if (index > -1) {
        array.splice(index, 1);
    }
}

function checkReminder() {
    const date = new Date();

    if (SRManager.getDateReminder().has(date.getFullYear())) {
        let year = SRManager.getDateReminder().years[date.getFullYear()];

        console.log(SRManager.getUserReminder());

        if (year.has(date.getMonth())) {
            let month = year.months[date.getMonth()];

            if (month.has(date.getDate())) {
                let day = month.days[date.getDate()];

                if (day.has(date.getHours())) {
                    let hour = day.hours[date.getHours()];

                    if (hour.has(date.getMinutes())) {
                        let min = hour.minutes[date.getMinutes()];

                        if (min.has(date.getSeconds())) {
                            let second = min.seconds[date.getSeconds()];

                            second.reminders.forEach((reminder) => {
                                reminder.sendMessage(client);
                                deleteElement(
                                    SRManager.getUserReminder().users[
                                        reminder.user
                                    ],
                                    reminder
                                );
                            });

                            delete min.seconds[date.getSeconds()];
                        }

                        if (isEmpty(min.seconds)) {
                            delete hour.minutes[date.getMinutes()];
                        }
                    }

                    if (isEmpty(hour.minutes)) {
                        delete day.hours[date.getHours()];
                    }
                }

                if (isEmpty(day.hours)) {
                    delete month.days[date.getDate()];
                }
            }
        }
    }
}

client.on("ready", () => {
    console.log("Bot is ready!");
});

client.on("message", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    let call = commandBody.substr(0, commandBody.indexOf(" ")).toLowerCase();
    let body = commandBody.substr(commandBody.indexOf(" ") + 1);

    if (call === "") {
        call = body.toLowerCase();
    }

    commandList.forEach((command) => {
        if (command.aliases.includes(call)) {
            commandReceived(message, command.call(message, body));
        }
    });
});
