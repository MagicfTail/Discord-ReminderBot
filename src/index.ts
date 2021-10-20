import * as Discord from "discord.js";
import * as fs from "fs";
import { commandList } from "./Commands";
import ReminderManager from "./ReminderManager";
import Repeating from "./Reminders/Repeating";
import Single from "./Reminders/Single";
import { deleteElement, zeroPad } from "./Utility";
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

// Add reminders to queue every 100ms
setInterval(() => {
    queueReminders();
}, 100);

// Handle queue every 500ms
setInterval(() => {
    checkReminder();
}, 500);

// Dumps the current reminders every hour
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

// Writes the waiting reminders to UserReminderData.json
function dumpRM() {
    fs.writeFileSync(
        "./data/UserReminderData.json",
        JSON.stringify(ReminderManager.getUserReminders())
    );

    let date = new Date();

    console.log(
        `${zeroPad(date.getHours(), 2)}:${zeroPad(
            date.getMinutes(),
            2
        )} Dumped UserReminders`
    );
}

// Reacts to the message, letting the user know if the command was successful
function commandReceived(message: Discord.Message, success: boolean) {
    if (success) {
        message.react("✅");
    } else {
        message.react("❎");
    }
}

// Adds every reminder in the current second to the queue
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

// Sends every reminder in the queue
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

// Set bot avatar and activity when ready
client.on("ready", () => {
    client.user.setActivity("!help");
    client.user
        .setAvatar("./assets/avatar.png")
        .then(() => console.log("New avatar set!"))
        .catch(console.error);
    console.log("Bot is ready!");
});

// Handles receiving messages
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

    // Special case for admin to dump the current reminders
    if (call == "dump" && message.author.id == process.env.ADMIN_ID) {
        dumpRM();
    }
});
