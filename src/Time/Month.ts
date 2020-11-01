import Time from "./Time";
import Day from "./Day";
import Single from "../Reminders/Single";
import Repeating from "../Reminders/Repeating";
import Year from "./Year";

export default class Month implements Time {
    days: { [key: number]: Day };
    parent: Year;

    constructor(year: Year) {
        this.days = {};
        this.parent = year;
    }

    addReminder(reminder: Single | Repeating) {
        const day = reminder.time.getDate();

        if (!(day in this.days)) {
            this.days[day] = new Day(this);
        }

        this.days[day].addReminder(reminder);
    }

    has(day: number): boolean {
        return day in this.days;
    }
}
