import Time from "./Time";
import Minute from "./Minute";
import Single from "../Reminders/Single";
import Repeating from "../Reminders/Repeating";
import Day from "./Day";

export default class Hour implements Time {
    minutes: { [key: number]: Minute };
    parent: Day;

    constructor(day: Day) {
        this.minutes = {};
        this.parent = day;
    }

    addReminder(reminder: Single | Repeating) {
        const minute = reminder.time.getMinutes();

        if (!(minute in this.minutes)) {
            this.minutes[minute] = new Minute(this);
        }

        this.minutes[minute].addReminder(reminder);
    }

    has(minute: number): boolean {
        return minute in this.minutes;
    }
}
