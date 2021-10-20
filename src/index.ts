import * as Discord from "discord.js";
import * as fs from "fs";
import { commandList } from "./Commands";
import ReminderManager from "./ReminderManager";
import Repeating from "./Reminders/Repeating";
import Single from "./Reminders/Single";
import { deleteElement } from "./Utility";
import * as dotenv from "dotenv";

dotenv.config();

const args = process.argv.slice(2);

var botToken = "";
var queuedReminders: (Single | Repeating)[] = [];
var prefix = "!";

if (process.env.PREFIX) {
    prefix = process.env.PREFIX;
}

// Check if dev mode and if bot key has been set
if (args.length > 1) {
    exitWithError("Usage: node [-d] ./dist/index.js");
} else if (args.length == 1) {
    if (args[0] == "-d") {
        if (!process.env.DEV_TOKEN) {
            exitWithError(
                `Create a file in the root directory called '.env' and add a developer bot token. Eg,
DEV_TOKEN=NzMwIFEuJAigISU2IJDdAiWi.IoIfhA.vnOIiioUUIOOoW_Y82HjDSji2NF`
            );
        } else {
            botToken = process.env.DEV_TOKEN;
        }
    } else {
        exitWithError("Usage: node [-d] ./dist/index.js");
    }
} else {
    if (!process.env.BOT_TOKEN) {
        exitWithError(
            `Create a file in the root directory called '.env' and add a bot token. Eg,
BOT_TOKEN=NzMwIFEuJAigISU2IJDdAiWi.IoIfhA.vnOIiioUUIOOoW_Y82HjDSji2NF`
        );
    } else {
        botToken = process.env.BOT_TOKEN;
    }
}

const client = new Discord.Client();
client.login(botToken).catch((e) => {
    console.log("Failed to login, please double check your BOT_TOKEN");
    process.exit();
});

ReminderManager.loadStoredReminders();

setInterval(() => {
    queueReminders();
}, 100);

setInterval(() => {
    checkReminder();
}, 500);

setInterval(() => {
    dumpRM();
}, 1000 * 60 * 60);

//dump when the app is closed
process.on("exit", dumpRM);

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

function exitWithError(error: string) {
    console.log(error);
    process.exit();
}

function dumpRM() {
    fs.writeFileSync(
        "./data/UserReminderData.json",
        JSON.stringify(ReminderManager.getUserReminders())
    );

    let date = new Date();

    console.log(`${date.getHours()}:${date.getMinutes()} Dumped UserReminders`);
}

function commandReceived(message: Discord.Message, success: boolean) {
    if (success) {
        message.react("✅");
    } else {
        message.react("❎");
    }
}

function queueReminders() {
    const date = new Date();

    const second = ReminderManager.getSecondByDate(date);
    if (!second) {
        return;
    }

    queuedReminders.push(...second.reminders);

    let parent = second.parent;

    delete parent.seconds[date.getSeconds()];

    ReminderManager.clean(parent, date);
}

function checkReminder() {
    queuedReminders.forEach((reminder) => {
        reminder.sendMessage(client);

        deleteElement(
            ReminderManager.getUserReminders().users[reminder.user],
            reminder
        );
    });

    queuedReminders = [];
}

client.on("ready", () => {
    client.user.setActivity("!help");
    client.user
        .setAvatar("./assets/avatar.png")
        .then((user) => console.log("New avatar set!"))
        .catch(console.error);
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

    if (call == "dump" && message.author.id == process.env.ADMIN_ID) {
        dumpRM();
    }
});

client.on("error", (e) => {
    console.log(e);
});
