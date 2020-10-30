import Command from "./command"
import * as Discord from 'discord.js'

export default class Ping implements Command {
    name = "Ping";
    description = "Pings the bot";
    aliases = ["ping", "p"];

    call(msg: Discord.Message, body: string) {
        try {
            msg.author.send(`Pong!`);

            return true;
        } catch (error) {
            console.log(error);

            return false;
        }
    }
}