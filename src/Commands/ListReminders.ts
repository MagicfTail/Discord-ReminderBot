import Command from "./command";
import * as Discord from "discord.js";
import ReminderManager from "../ReminderManager";

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

            ReminderManager.getUserReminders().users[msg.author.id].forEach(
                (reminder) => {
                    reminderEmbed.addField(
                        `${reminder.message} ${reminder.muted ? "(m)" : ""}`,
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
