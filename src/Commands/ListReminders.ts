import Command from "./command";
import * as Discord from "discord.js";
import ReminderManager from "../ReminderManager";
import { millisToFormattedTime } from "../Utility";

export default class ListReminders implements Command {
    name = "List Reminders";
    description = "Lists all your reminders";
    aliases = ["list", "l"];

    call(msg: Discord.Message, body: string) {
        try {
            const reminderEmbed = new Discord.MessageEmbed()
                .setColor("#0099ff")
                .setAuthor("ReminderBot")
                .setDescription("Your Reminders");

            const currentTime = new Date();

            ReminderManager.getUserReminders().users[msg.author.id].forEach(
                (reminder) => {
                    const timeDiff =
                        reminder.time.getTime() - currentTime.getTime();

                    reminderEmbed.addField(
                        `${reminder.message} ${
                            reminder.suspended
                                ? "*(s)*"
                                : reminder.muted
                                ? "*(m)*"
                                : ""
                        }`,
                        `${millisToFormattedTime(timeDiff)}
                        \`Id: ${reminder.id}\``
                    );
                }
            );

            msg.author.send(reminderEmbed);

            return true;
        } catch (error) {
            console.log(error);

            return false;
        }
    }
}
