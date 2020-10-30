import Repeating from "./Reminders/Repeating";
import Single from "./Reminders/Single";

export default class UserReminders {
    users: { [key: string]: (Single | Repeating)[] };

    constructor() {
        this.users = {};
    }

    addReminder(reminder: Single | Repeating) {
        const userId = reminder.user;
        if (!(userId in this.users)) {
            this.users[userId] = [];
        }

        this.users[userId].push(reminder);
    }
}
