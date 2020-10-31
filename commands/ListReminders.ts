import Command from "./command";
import * as Discord from "discord.js";
import SRManager from "../StoredReminderManager";

export default class ListReminders implements Command {
    name = "List Reminders";
    description = "Gets all your reminders";
    aliases = ["list", "l"];

    call(msg: Discord.Message, body: string) {
        try {
            const reminderEmbed = new Discord.MessageEmbed()
                .setColor("#0099ff")
                .setAuthor("ReminderBot")
                .setDescription("Your Reminders");

            SRManager.getUserReminders().users[msg.author.id].forEach(
                (reminder) => {
                    reminderEmbed.addField(
                        `${reminder.message} ${
                            reminder.suspended ? "(s)" : ""
                        }`,
                        `Id: ${reminder.id}`
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
