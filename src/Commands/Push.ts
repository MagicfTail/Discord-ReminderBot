import Command from "./Command";
import * as Discord from "discord.js";
import Repeating from "../Reminders/Repeating";
import ReminderManager from "../ReminderManager";
import Single from "../Reminders/Single";
import { findReminder } from "../Utility";

// Regex matching 2d3hour4mins5sec and other combinations
const timeRegex =
    /(?:(\d+)(?:days|day|d))?(?:(\d+)(?:hours|hour|h))?(?:(\d+)(?:minutes|minute|mins|min|m))?(?:(\d+)(?:seconds|second|secs|sec|s))?/;

// Delays the reminder a certain amount of time
export default class Push implements Command {
    name = "Push";
    description = `Pushes back a reminder
    
    Usage: !p *delay* *message id*
    Example: !p 1d1h1m1s 65834478-73d7-4d10-ae93-5cc5a4feccef
    Usage: !p *delay* *message text*
    Example: !p 1d1h1m1s Message goes here`;
    aliases = ["push", "p"];

    call(msg: Discord.Message, body: string) {
        try {
            // Split the message and make sure there's a delay
            let delayString = body.substr(0, body.indexOf(" ")).toLowerCase();
            let message = body.substr(body.indexOf(" ") + 1);

            if (delayString === "") {
                return false;
            }

            let match = delayString.match(timeRegex);

            if (match[0] == "") {
                return false;
            }

            // Find the reminder to push
            let reminder = findReminder(msg.author.id, message);

            // Get regexed delay to usable format
            let times = match.slice(1).map((val) => {
                if (val === undefined) {
                    return 0;
                } else {
                    return parseInt(val);
                }
            });

            // Create a new date with the delay
            let date = new Date();

            date.setDate(reminder.time.getDate() + times[0]);
            date.setHours(reminder.time.getHours() + times[1]);
            date.setMinutes(reminder.time.getMinutes() + times[2]);
            date.setSeconds(reminder.time.getSeconds() + times[3]);

            // Create a new reminder using the old reminder and date
            if (reminder instanceof Repeating) {
                let newReminder = new Repeating(
                    reminder.user,
                    reminder.message,
                    date,
                    reminder.delta,
                    reminder.id,
                    reminder.muted,
                    reminder.suspended
                );

                ReminderManager.addReminder(newReminder);
            } else {
                let newReminder = new Single(
                    reminder.user,
                    reminder.message,
                    date,
                    reminder.id,
                    reminder.muted
                );

                ReminderManager.addReminder(newReminder);
            }

            // Delete the old reminder
            ReminderManager.removeReminder(reminder);

            return true;
        } catch (error) {
            console.log(error);

            return false;
        }
    }
}
