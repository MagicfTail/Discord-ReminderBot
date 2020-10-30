import Time from "./Time";
import Hour from "./Hour";
import Single from "../Reminders/Single";
import Repeating from "../Reminders/Repeating";

export default class Day implements Time {
    hours: { [key: number]: Hour };

    constructor() {
        this.hours = {};
    }

    addReminder(reminder: Single | Repeating) {
        const hour = reminder.time.getHours();

        if (!(hour in this.hours)) {
            this.hours[hour] = new Hour();
        }

        this.hours[hour].addReminder(reminder);
    }

    has(hour: number): boolean {
        return hour in this.hours;
    }
}
