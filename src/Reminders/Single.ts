import * as Discord from "discord.js";
import { v4 } from "uuid";

export default class Single {
    user: string;
    message: string;
    time: Date;
    id: string;
    muted: boolean;
    suspended: boolean = false;

    constructor(user: string, message: string, time: Date, muted?: boolean) {
        this.user = user;
        this.message = message;
        this.time = time;
        this.id = v4();
        this.muted = (muted ?? muted) || false;
    }

    sendMessage(client: Discord.Client) {
        if (!this.muted) {
            client.users.fetch(this.user).then((user) => {
                user.send(this.message);
            });
        }
    }
}
