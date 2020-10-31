import * as config from "./config.json";
import { BOT_TOKEN } from "./token.json";
import * as Discord from "discord.js";
import * as fs from "fs";
import { commandList } from "./Commands";
import SRManager from "./StoredReminderManager";
import Repeating from "./Reminders/Repeating";
import Single from "./Reminders/Single";
import DateReminders from "./DateReminders";
import Time from "./time/Time";
import Minute from "./time/Minute";
import Second from "./time/Second";

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
// process.on("uncaughtException", exitHandler);

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

function deleteElement(array: (Single | Repeating)[], key: Single | Repeating) {
    const index = array.indexOf(key, 0);
    if (index > -1) {
        array.splice(index, 1);
    }
}

function checkReminder() {
    const date = new Date();

    const second = SRManager.getSecondByDate(date);
    if (!second) {
        return;
    }

    second.reminders.forEach((reminder) => {
        reminder.sendMessage(client);
        deleteElement(
            SRManager.getUserReminders().users[reminder.user],
            reminder
        );
    });

    SRManager.clean(second, date);
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
