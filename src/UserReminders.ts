import Repeating from "./Reminders/Repeating";
import Single from "./Reminders/Single";

// Structure containing all reminders, indexed by user
export default class UserReminders {
    users: { [key: string]: (Single | Repeating)[] };

    constructor(obj?: any) {
        this.users = (obj ?? obj) || {};
    }

    addReminder(reminder: Single | Repeating) {
        const userId = reminder.user;
        if (!(userId in this.users)) {
            this.users[userId] = [];
        }

        this.users[userId].push(reminder);
    }
}
