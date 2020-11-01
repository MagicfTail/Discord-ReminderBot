import Time from "./Time";
import Hour from "./Hour";
import Single from "../Reminders/Single";
import Repeating from "../Reminders/Repeating";
import Month from "./Month";

export default class Day implements Time {
    hours: { [key: number]: Hour };
    parent: Month;

    constructor(month: Month) {
        this.hours = {};
        this.parent = month;
    }

    addReminder(reminder: Single | Repeating) {
        const hour = reminder.time.getHours();

        if (!(hour in this.hours)) {
            this.hours[hour] = new Hour(this);
        }

        this.hours[hour].addReminder(reminder);
    }

    has(hour: number): boolean {
        return hour in this.hours;
    }
}
