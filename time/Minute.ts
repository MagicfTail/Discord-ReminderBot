import Time from "./Time";
import Second from "./Second";
import Single from "../Reminders/Single";
import Repeating from "../Reminders/Repeating";

export default class Minute implements Time {
    seconds: { [key: number]: Second };

    constructor() {
        this.seconds = {};
    }

    addReminder(reminder: Single | Repeating) {
        const second = reminder.time.getSeconds();

        if (!(second in this.seconds)) {
            this.seconds[second] = new Second();
        }

        this.seconds[second].addReminder(reminder);
    }

    has(second: number): boolean {
        return second in this.seconds;
    }
}
