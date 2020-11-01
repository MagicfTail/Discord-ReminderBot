import Time from "./Time";
import Second from "./Second";
import Single from "../Reminders/Single";
import Repeating from "../Reminders/Repeating";
import Hour from "./Hour";

export default class Minute implements Time {
    seconds: { [key: number]: Second };
    parent: Hour;

    constructor(hour: Hour) {
        this.seconds = {};
        this.parent = hour;
    }

    addReminder(reminder: Single | Repeating) {
        const second = reminder.time.getSeconds();

        if (!(second in this.seconds)) {
            this.seconds[second] = new Second(this);
        }

        this.seconds[second].addReminder(reminder);
    }

    has(second: number): boolean {
        return second in this.seconds;
    }
}
