import * as Discord from "discord.js";

//Command interface
export default interface Command {
    name: string;
    description: string;
    aliases: string[];
    call(msg: Discord.Message, body: string): boolean;
}
