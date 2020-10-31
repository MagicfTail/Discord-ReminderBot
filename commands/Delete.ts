import Command from "./command";
import * as Discord from "discord.js";
import SRManager from "../StoredReminderManager";

export default class Delete implements Command {
    name = "Delete";
    description = `Deletes a reminder
    Usage: $d *message id*
    Example: $d 65834478-73d7-4d10-ae93-5cc5a4feccef`;
    aliases = ["delete", "d"];

    call(msg: Discord.Message, body: string) {
        try {
            const reminder = SRManager.getUserReminders().users[
                msg.author.id
            ].find((r) => {
                return r.id == body;
            });

            if (!reminder) {
                return false;
            }

            SRManager.removeReminder(reminder);

            return true;
        } catch (error) {
            console.log(error);

            return false;
        }
    }
}
