import * as Discord from "discord.js";
import { v4 } from "uuid";

export default class Single {
    user: string;
    message: string;
    time: Date;
    id: string;
    suspended: boolean;

    constructor(
        user: string,
        message: string,
        time: Date,
        suspended?: boolean
    ) {
        this.user = user;
        this.message = message;
        this.time = time;
        this.id = v4();
        this.suspended = (suspended ?? suspended) || false;
    }

    sendMessage(client: Discord.Client) {
        if (!this.suspended) {
            client.users.fetch(this.user).then((user) => {
                user.send(this.message);
            });
        }
    }
}
