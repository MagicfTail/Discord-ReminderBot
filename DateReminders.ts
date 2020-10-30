import Year from "./time/Year";
import Repeating from "./Reminders/Repeating";
import Single from "./Reminders/Single";

export default class StoredReminders {
    years: { [key: number]: Year };

    constructor() {
        this.years = {};
    }

    addReminder(reminder: Single | Repeating) {
        const year = reminder.time.getFullYear();

        if (!(year in this.years)) {
            this.years[year] = new Year();
        }

        this.years[year].addReminder(reminder);
    }

    has(year: number): boolean {
        return year in this.years;
    }
}
