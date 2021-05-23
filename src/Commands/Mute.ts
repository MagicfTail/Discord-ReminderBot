import Command from "./command";
import * as Discord from "discord.js";
import { findReminder } from "../Utility";

export default class Mute implements Command {
    name = "Mute";
    description = `Toggles mute of a reminder

    Usage: !m *message id*
    Example: !m 65834478-73d7-4d10-ae93-5cc5a4feccef
    Usage: !m *message text*
    Example: !m Message goes here`;
    aliases = ["mute", "m"];

    call(msg: Discord.Message, body: string) {
        try {
            let reminder = findReminder(msg.author.id, body);

            reminder.muted = !reminder.muted;

            return true;
        } catch (error) {
            console.log(error);

            return false;
        }
    }
}
