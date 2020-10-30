import * as Discord from "discord.js";
import { v4 } from "uuid";

export default class Single {
    user: string;
    message: string;
    time: Date;
    id: string;

    constructor(user: string, message: string, time: Date) {
        this.user = user;
        this.message = message;
        this.time = time;
        this.id = v4();
    }

    sendMessage(client: Discord.Client) {
        const user = client.users.cache.get(this.user);

        user.send(this.message);
    }
}
