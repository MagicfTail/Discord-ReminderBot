import Time from "./Time";
import Month from "./Month";
import Single from "../Reminders/Single";
import Repeating from "../Reminders/Repeating";

export default class Year implements Time {
    months: { [key: number]: Month };

    constructor() {
        this.months = {};
    }

    addReminder(reminder: Single | Repeating) {
        const month = reminder.time.getMonth();

        if (!(month in this.months)) {
            this.months[month] = new Month();
        }

        this.months[month].addReminder(reminder);
    }

    has(month: number): boolean {
        return month in this.months;
    }
}
