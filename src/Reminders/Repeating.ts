import * as Discord from "discord.js";
import Single from "./Single";
import ReminderManager from "../ReminderManager";
import { v4 } from "uuid";

export default class Repeating extends Single {
    user: string;
    message: string;
    time: Date;
    delta: number[];
    id: string;
    muted: boolean;
    suspended: boolean;

    constructor(
        user: string,
        message: string,
        time: Date,
        delta: number[],
        id?: string,
        muted?: boolean,
        suspended?: boolean
    ) {
        super(user, message, time, muted);

        this.delta = delta;
        this.id = (id ?? id) || v4();
        this.suspended = (suspended ?? suspended) || false;
    }

    sendMessage(client: Discord.Client) {
        if (!this.muted) {
            client.users.fetch(this.user).then((user) => {
                user.send(this.message);
            });
        }

        let date = this.time;
        date.setDate(date.getDate() + this.delta[0]);
        date.setHours(date.getHours() + this.delta[1]);
        date.setMinutes(date.getMinutes() + this.delta[2]);
        date.setSeconds(date.getSeconds() + this.delta[3]);

        let repeating = new Repeating(
            this.user,
            this.message,
            date,
            this.delta,
            this.id,
            this.muted
        );

        ReminderManager.addReminder(repeating);
    }
}
