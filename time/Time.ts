import Single from "../Reminders/Single";
import Repeating from "../Reminders/Repeating";

export default interface Time {
    addReminder(reminder: Single | Repeating): void;
}
