import Command from "./Command";
import { commandList } from "../Commands";
import * as Discord from "discord.js";

export default class Help implements Command {
    name = "Help";
    description = "Displays commands";
    aliases = ["help", "h"];

    call(msg: Discord.Message, body: string) {
        try {
            const helpEmbed = new Discord.MessageEmbed()
                .setColor("#0099ff")
                .setAuthor("ReminderBot")
                .setDescription("Available commands");

            commandList.forEach((command) => {
                helpEmbed.addField(
                    `${command.name} (${command.aliases})`,
                    `${command.description}`
                );
            });

            msg.author.send(helpEmbed);

            return true;
        } catch (error) {
            console.log(error);

            return false;
        }
    }
}
