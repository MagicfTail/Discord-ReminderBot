import Single from "../Reminders/Single";
import Repeating from "../Reminders/Repeating";
import DateReminders from "../DateReminders";

export default interface Time {
    parent: Time | DateReminders;
    addReminder(reminder: Single | Repeating): void;
}
