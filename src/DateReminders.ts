import Year from "./Time/Year";
import Repeating from "../src/Reminders/Repeating";
import Single from "../src/Reminders/Single";

// Structure containing all reminders, indexed by date
export default class DateReminders {
    years: { [key: number]: Year };

    constructor() {
        this.years = {};
    }

    addReminder(reminder: Single | Repeating) {
        const year = reminder.time.getFullYear();

        if (!(year in this.years)) {
            this.years[year] = new Year(this);
        }

        this.years[year].addReminder(reminder);
    }

    has(year: number): boolean {
        return year in this.years;
    }
}
