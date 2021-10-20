// Structure keep track of how many times a user has errored out
export default class ErrorCounter {
    users: { [key: string]: number };

    // Reset on startup
    constructor() {
        this.users = {};
    }

    incrementCounter(userId: string) {
        if (!(userId in this.users)) {
            this.users[userId] = 0;
        }

        this.users[userId]++;
    }

    getCounter(userId: string) {
        if (!(userId in this.users)) {
            return 0;
        }

        return this.users[userId];
    }

    clearUser(userId: string) {
        if (!(userId in this.users)) {
            return;
        }

        delete this.users[userId];
    }
}
