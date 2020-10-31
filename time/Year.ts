import Time from "./Time";
import Month from "./Month";
import Single from "../Reminders/Single";
import Repeating from "../Reminders/Repeating";
import DateReminders from "../DateReminders";

export default class Year implements Time {
    months: { [key: number]: Month };
    parent: DateReminders;

    constructor(dateReminder: DateReminders) {
        this.months = {};
        this.parent = dateReminder;
    }

    addReminder(reminder: Single | Repeating) {
        const month = reminder.time.getMonth();

        if (!(month in this.months)) {
            this.months[month] = new Month(this);
        }

        this.months[month].addReminder(reminder);
    }

    has(month: number): boolean {
        return month in this.months;
    }
}
