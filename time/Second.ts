import Time from "./Time";
import Single from "../Reminders/Single";
import Repeating from "../Reminders/Repeating";

export default class Second implements Time {
    reminders: (Single | Repeating)[];

    constructor() {
        this.reminders = [];
    }

    addReminder(reminder: Single | Repeating) {
        this.reminders.push(reminder);
    }

    removeReminder(id: string) {
        this.reminders.filter((reminder) => {
            return reminder.id !== id;
        });
    }
}
