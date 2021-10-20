import DateReminders from "./DateReminders";
import Repeating from "./Reminders/Repeating";
import Single from "./Reminders/Single";
import Second from "./Time/Second";
import UserReminders from "./UserReminders";
import * as fs from "fs";
import Minute from "./Time/Minute";
import { deleteElement } from "./Utility";
import ErrorCounter from "./ErrorCounter";

export default abstract class ReminderManager {
    static dr: DateReminders;
    static ur: UserReminders;
    static ec: ErrorCounter;

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

    static getErrorCounter(): ErrorCounter {
        if (!this.ec) {
            this.ec = new ErrorCounter();
        }

        return this.ec;
    }

    static loadStoredReminders() {
        try {
            let file = fs.readFileSync("./data/UserReminderData.json", "utf8");

            this.ur = JSON.parse(file, (key: string, value: any) => {
                if (key == "") {
                    return new UserReminders(value["users"]);
                } else if (key == "time") {
                    return new Date(value);
                } else if (
                    !isNaN(Number(key)) &&
                    key.length < 5 &&
                    typeof value === "object"
                ) {
                    if ("delta" in value) {
                        let savedMessage: string = value["message"];
                        let savedDate: Date = value["time"];
                        let savedDelta: number[] = value["delta"];

                        if (savedDate.getTime() < Date.now()) {
                            let differenceMilli =
                                Date.now() - savedDate.getTime();
                            let deltaMilli =
                                (((savedDelta[0] * 24 + savedDelta[1]) * 60 +
                                    savedDelta[2]) *
                                    60 +
                                    savedDelta[3]) *
                                1000;

                            savedDate = new Date(
                                savedDate.getTime() +
                                    Math.ceil(differenceMilli / deltaMilli) *
                                        deltaMilli +
                                    1000
                            );
                        }

                        return new Repeating(
                            value["user"],
                            savedMessage,
                            savedDate,
                            savedDelta,
                            value["muted"],
                            value["suspended"]
                        );
                    } else {
                        let savedDate: Date = value["time"];
                        let savedMessage: string = value["message"];

                        if (savedDate.getTime() < Date.now()) {
                            savedDate = new Date(Date.now() + 1000);
                            savedMessage = "Delayed!\n" + savedMessage;
                        }

                        return new Single(
                            value["user"],
                            savedMessage,
                            savedDate,
                            value["muted"]
                        );
                    }
                }

                return value;
            });

            Object.values(this.getUserReminders().users).forEach(
                (v: (Single | Repeating)[]) => {
                    v.forEach((r) => {
                        this.getDateReminders().addReminder(r);
                    });
                }
            );
        } catch (e) {
            console.log(e);
        }
    }

    private static isEmpty(obj: Object): boolean {
        return Object.keys(obj).length == 0;
    }

    static addReminder(reminder: Single | Repeating) {
        ReminderManager.getDateReminders().addReminder(reminder);
        ReminderManager.getUserReminders().addReminder(reminder);
    }

    static removeReminder(reminder: Single | Repeating) {
        this.removeReminderFromUser(reminder);
        this.removeReminderFromDate(reminder);
    }

    static removeReminderFromUser(reminder: Single | Repeating) {
        deleteElement(this.ur.users[reminder.user], reminder);
    }

    static removeReminderFromDate(reminder: Single | Repeating) {
        const second = this.getSecondByDate(reminder.time);
        deleteElement(second.reminders, reminder);

        this.clean(second, reminder.time);
    }

    static clean(second: Second | Minute, date: Date) {
        if (second instanceof Minute || this.isEmpty(second.reminders)) {
            let minute = second instanceof Minute ? second : second.parent;

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
    }

    static getSecondByDate(date: Date): Second {
        if (ReminderManager.getDateReminders().has(date.getFullYear())) {
            let year =
                ReminderManager.getDateReminders().years[date.getFullYear()];

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
}
