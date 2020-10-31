import * as Discord from "discord.js";
import Single from "./Single";
import SRManager from "../StoredReminderManager";
import { v4 } from "uuid";

export default class Repeating extends Single {
    user: string;
    message: string;
    time: Date;
    id: string;
    delta: number[];
    suspended: boolean;

    constructor(
        user: string,
        message: string,
        time: Date,
        delta: number[],
        id?: string
    ) {
        super(user, message, time);

        this.delta = delta;
        this.id = (id ?? id) || v4();
    }

    sendMessage(client: Discord.Client) {
        if (!this.suspended) {
            const user = client.users.cache.get(this.user);
            user.send(this.message);
        }

        let date = new Date();
        date.setDate(date.getDate() + this.delta[0]);
        date.setHours(date.getHours() + this.delta[1]);
        date.setMinutes(date.getMinutes() + this.delta[2]);
        date.setSeconds(date.getSeconds() + this.delta[3]);

        let repeating = new Repeating(
            this.user,
            this.message,
            date,
            this.delta,
            this.id
        );

        SRManager.getDateReminders().addReminder(repeating);
        SRManager.getUserReminders().addReminder(repeating);
    }
}
