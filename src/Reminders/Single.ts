import * as Discord from "discord.js";
import { v4 } from "uuid";

// A single use reminder
export default class Single {
    user: string;
    message: string;
    time: Date;
    id: string;
    muted: boolean;
    suspended: boolean = false;

    constructor(
        user: string,
        message: string,
        time: Date,
        id?: string,
        muted?: boolean
    ) {
        this.user = user;
        this.message = message;
        this.time = time;
        this.id = id ? id : v4();
        this.muted = muted ? muted : false;
    }

    sendMessage(client: Discord.Client) {
        if (!this.muted) {
            client.users.fetch(this.user).then((user) => {
                user.send(this.message).catch((user: Discord.User) =>
                    console.log(`Couldn't send message to ${user.username}`)
                );
            });
        }
    }
}
