import Time from "./Time";
import Minute from "./Minute";
import Single from "../Reminders/Single";
import Repeating from "../Reminders/Repeating";

export default class Hour implements Time {
    minutes: { [key: number]: Minute };

    constructor() {
        this.minutes = {};
    }

    addReminder(reminder: Single | Repeating) {
        const minute = reminder.time.getMinutes();

        if (!(minute in this.minutes)) {
            this.minutes[minute] = new Minute();
        }

        this.minutes[minute].addReminder(reminder);
    }

    has(minute: number): boolean {
        return minute in this.minutes;
    }
}
