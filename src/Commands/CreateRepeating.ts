import Command from "./Command";
import * as Discord from "discord.js";
import Repeating from "../Reminders/Repeating";
import ReminderManager from "../ReminderManager";

// Regex matching 2d3hour4mins5sec and other combinations
const timeRegex =
    /(?:(\d+)(?:days|day|d))?(?:(\d+)(?:hours|hour|h))?(?:(\d+)(?:minutes|minute|mins|min|m))?(?:(\d+)(?:seconds|second|secs|sec|s))?/;

// Command for creating a repeating reminder
export default class CreateRepeating implements Command {
    name = "Repeating";
    description = `Set a repeating reminder
    
    Format: !rr *delay* *reminder message*
    Example: !rr 1d1h1m1s This is a message :)`;
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

            if (match[0] == "") {
                return false;
            }

            let times = match.slice(1).map((val) => {
                if (val === undefined) {
                    return 0;
                } else {
                    return parseInt(val);
                }
            });

            if (times[0] == 0 && times[1] == 0 && times[2] < 5) {
                msg.author.send("Delay must be at least 5 minutes");
                return false;
            }

            let date = new Date();

            date.setDate(date.getDate() + times[0]);
            date.setHours(date.getHours() + times[1]);
            date.setMinutes(date.getMinutes() + times[2]);
            date.setSeconds(date.getSeconds() + times[3]);

            let reminder = new Repeating(msg.author.id, message, date, times);

            ReminderManager.addReminder(reminder);

            return true;
        } catch (error) {
            console.log(error);

            return false;
        }
    }
}
