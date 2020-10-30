import Command from "./Command";
import * as Discord from "discord.js";
import Repeating from "../Reminders/Repeating";
import SRManager from "../StoredReminderManager";

const timeRegex = /(?:(\d+)(?:days|day|d))?(?:(\d+)(?:hours|hour|h))?(?:(\d+)(?:minutes|minute|mins|min|m))?(?:(\d+)(?:seconds|second|secs|sec|s))?/;

export default class CreateRepeating implements Command {
    name = "Repeating";
    description =
        "Set a repeating reminder \n Format: $rr *delay* *reminder message* \n Example: $rr 1d1h1m1s This is a message :)";
    aliases = ["repeating", "rr", "rp"];

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

            let reminder = new Repeating(msg.author.id, message, date, times);

            SRManager.getDateReminder().addReminder(reminder);
            SRManager.getUserReminder().addReminder(reminder);

            return true;
        } catch (error) {
            console.log(error);

            return false;
        }
    }
}
