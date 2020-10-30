import Time from "./Time";
import Day from "./Day";
import Single from "../Reminders/Single";
import Repeating from "../Reminders/Repeating";

export default class Month implements Time {
    days: { [key: number]: Day };

    constructor() {
        this.days = {};
    }

    addReminder(reminder: Single | Repeating) {
        const day = reminder.time.getDate();

        if (!(day in this.days)) {
            this.days[day] = new Day();
        }

        this.days[day].addReminder(reminder);
    }

    has(day: number): boolean {
        return day in this.days;
    }
}
