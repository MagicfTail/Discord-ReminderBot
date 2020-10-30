import Command from "./Command";
import * as Discord from "discord.js";
import Single from "../Reminders/Single";
import SRManager from "../StoredReminderManager";

const timeRegex = /(?:(\d+)(?:days|day|d))?(?:(\d+)(?:hours|hour|h))?(?:(\d+)(?:minutes|minute|mins|min|m))?(?:(\d+)(?:seconds|second|secs|sec|s))?/;

export default class CreateSingle implements Command {
    name = "Reminder";
    description =
        "Set a reminder \n Format: $r *delay* *reminder message* \n Example: $r 1d1h1m1s This is a message :)";
    aliases = ["reminder", "r"];

    call(msg: Discord.Message, body: string) {
        try {
            let delayString = body.substr(0, body.indexOf(" ")).toLowerCase();
            let message = body.substr(body.indexOf(" ") + 1);

            if (delayString === "") {
                delayString = message;
                message = "Reminder!";
            }

            let match = delayString.match(timeRegex);

            let times = match.slice(1).map((val) => {
                if (val === undefined) {
                    return 0;
                } else {
                    return parseInt(val);
                }
            });

            let date = new Date();

            date.setDate(date.getDate() + times[0]);
            date.setHours(date.getHours() + times[1]);
            date.setMinutes(date.getMinutes() + times[2]);
            date.setSeconds(date.getSeconds() + times[3]);

            let reminder = new Single(msg.author.id, message, date);

            SRManager.getDateReminder().addReminder(reminder);
            SRManager.getUserReminder().addReminder(reminder);

            return true;
        } catch (error) {
            console.log(error);

            return false;
        }
    }
}
