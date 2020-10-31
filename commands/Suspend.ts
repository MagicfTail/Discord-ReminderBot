import Command from "./command";
import * as Discord from "discord.js";
import SRManager from "../StoredReminderManager";

export default class Suspend implements Command {
    name = "Suspend";
    description = `Suspends a reminder
    Usage: $s *message id*
    Example: $s 65834478-73d7-4d10-ae93-5cc5a4feccef`;
    aliases = ["suspend", "s", "pause", "p"];

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

            reminder.suspended = !reminder.suspended;

            return true;
        } catch (error) {
            console.log(error);

            return false;
        }
    }
}
