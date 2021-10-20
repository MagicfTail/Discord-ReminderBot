import ReminderManager from "./ReminderManager";
import Single from "./Reminders/Single";
import Repeating from "./Reminders/Repeating";

export function millisToFormattedTime(millis: number): string {
    var ms = millis % 1000;
    millis = (millis - ms) / 1000;
    var secs = millis % 60;
    millis = (millis - secs) / 60;
    var mins = millis % 60;
    var hrs = (millis - mins) / 60;

    return hrs + "h " + mins + "m " + secs + "s";
}

export function findReminder(authorId: string, message: string) {
    const userReminders = ReminderManager.getUserReminders().users[authorId];

    if (!userReminders) {
        throw "Unable to find message";
    }

    const reminder = userReminders.find((r) => {
        return (
            r.id == message || r.message.toLowerCase() == message.toLowerCase()
        );
    });

    if (!reminder) {
        throw "Unable to find message";
    }

    return reminder;
}

// Deletes an element from
export function deleteElement(
    array: (Single | Repeating)[],
    key: Single | Repeating
) {
    const index = array.indexOf(key, 0);
    if (index > -1) {
        array.splice(index, 1);
    }
}
