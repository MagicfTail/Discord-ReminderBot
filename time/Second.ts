import Time from "./Time";
import Single from "../Reminders/Single";
import Repeating from "../Reminders/Repeating";
import Minute from "./Minute";

export default class Second implements Time {
    reminders: (Single | Repeating)[];
    parent: Minute;

    constructor(minute: Minute) {
        this.reminders = [];
        this.parent = minute;
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
