import DateReminders from "./DateReminders";
import Repeating from "./Reminders/Repeating";
import Single from "./Reminders/Single";
import Day from "./time/Day";
import Second from "./time/Second";
import UserReminders from "./UserReminders";

export default abstract class SRManager {
    static dr: DateReminders;
    static ur: UserReminders;

    static getDateReminders(): DateReminders {
        if (!this.dr) {
            this.dr = new DateReminders();
        }

        return this.dr;
    }

    static getUserReminders(): UserReminders {
        if (!this.ur) {
            this.ur = new UserReminders();
        }

        return this.ur;
    }

    private static isEmpty(obj: Object): boolean {
        return Object.keys(obj).length == 0;
    }

    static removeReminder(reminder: Single | Repeating) {
        const second = this.getSecondByDate(reminder.time);
        this.deleteElement(this.ur.users[reminder.user], reminder);
        this.deleteElement(second.reminders, reminder);

        this.clean(second, reminder.time);
    }

    static clean(second: Second, date: Date) {
        let minute = second.parent;

        delete minute.seconds[date.getSeconds()];

        if (this.isEmpty(minute.seconds)) {
            let hour = minute.parent;

            delete hour.minutes[date.getMinutes()];

            if (this.isEmpty(hour.minutes)) {
                let day = hour.parent;

                delete day.hours[date.getHours()];

                if (this.isEmpty(day.hours)) {
                    let month = day.parent;

                    delete month.days[date.getDate()];

                    if (this.isEmpty(month.days)) {
                        let year = month.parent;

                        delete year.months[date.getMonth()];

                        if (this.isEmpty(year.months)) {
                            let dr = year.parent;

                            delete dr.years[date.getFullYear()];
                        }
                    }
                }
            }
        }
    }

    static getSecondByDate(date: Date): Second {
        if (SRManager.getDateReminders().has(date.getFullYear())) {
            let year = SRManager.getDateReminders().years[date.getFullYear()];

            if (year.has(date.getMonth())) {
                let month = year.months[date.getMonth()];

                if (month.has(date.getDate())) {
                    let day = month.days[date.getDate()];

                    if (day.has(date.getHours())) {
                        let hour = day.hours[date.getHours()];

                        if (hour.has(date.getMinutes())) {
                            let min = hour.minutes[date.getMinutes()];

                            if (min.has(date.getSeconds())) {
                                let second = min.seconds[date.getSeconds()];

                                return second;
                            }
                        }
                    }
                }
            }
        }
    }

    private static deleteElement(
        array: (Single | Repeating)[],
        key: Single | Repeating
    ) {
        const index = array.indexOf(key, 0);
        if (index > -1) {
            array.splice(index, 1);
        }
    }
}
