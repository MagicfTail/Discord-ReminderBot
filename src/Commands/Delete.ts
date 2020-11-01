import Command from "./command";
import * as Discord from "discord.js";
import ReminderManager from "../ReminderManager";

export default class Delete implements Command {
    name = "Delete";
    description = `Deletes a reminder
    
    Usage: !d *message id*
    Example: !d 65834478-73d7-4d10-ae93-5cc5a4feccef
    Usage: !d *message text*
    Example: !d Message goes here`;
    aliases = ["delete", "d"];

    call(msg: Discord.Message, body: string) {
        try {
            const userReminders = ReminderManager.getUserReminders().users[
                msg.author.id
            ];

            if (!userReminders) {
                return false;
            }

            const reminder = userReminders.find((r) => {
                return (
                    r.id == body ||
                    r.message.toLowerCase() == body.toLowerCase()
                );
            });

            if (!reminder) {
                return false;
            }

            ReminderManager.removeReminder(reminder);

            return true;
        } catch (error) {
            console.log(error);

            return false;
        }
    }
}
