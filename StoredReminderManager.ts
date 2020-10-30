import DateReminders from "./DateReminders";
import UserReminders from "./UserReminders";

export default abstract class SRManager {
    static dr: DateReminders;
    static ur: UserReminders;

    static getDateReminder(): DateReminders {
        if (!this.dr) {
            this.dr = new DateReminders();
        }

        return this.dr;
    }

    static getUserReminder(): UserReminders {
        if (!this.ur) {
            this.ur = new UserReminders();
        }

        return this.ur;
    }
}
