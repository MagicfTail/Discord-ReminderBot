import Command from "./command";
import * as Discord from "discord.js";
import ReminderManager from "../ReminderManager";
import Repeating from "../Reminders/Repeating";
import { findReminder } from "../Utility";

export default class Suspend implements Command {
    name = "Suspend";
    description = `Suspends a reminder, un-suspending will reset the reminder at the current time

    Usage: !s *message id*
    Example: !s 65834478-73d7-4d10-ae93-5cc5a4feccef
    Usage: !s *message text*
    Example: !s Message`;
    aliases = ["suspend", "s"];

    call(msg: Discord.Message, body: string) {
        try {
            let reminder = findReminder(msg.author.id, body);

            if (!(reminder instanceof Repeating)) {
                return false;
            }

            if (!reminder.suspended) {
                reminder.suspended = !reminder.suspended;
                ReminderManager.removeReminderFromDate(reminder);
            } else {
                let date = new Date();

                date.setDate(date.getDate() + reminder.delta[0]);
                date.setHours(date.getHours() + reminder.delta[1]);
                date.setMinutes(date.getMinutes() + reminder.delta[2]);
                date.setSeconds(date.getSeconds() + reminder.delta[3]);

                ReminderManager.addReminder(
                    new Repeating(
                        reminder.user,
                        reminder.message,
                        date,
                        reminder.delta,
                        reminder.id,
                        reminder.muted,
                        false
                    )
                );

                ReminderManager.removeReminderFromUser(reminder);
            }

            return true;
        } catch (error) {
            console.log(error);

            return false;
        }
    }
}
