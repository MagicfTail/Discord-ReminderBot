import Command from "./commands/command";
import Ping from "./commands/ping";
import CreateSingle from "./commands/CreateSingle";
import CreateRepeating from "./commands/CreateRepeating";
import ListReminders from "./commands/ListReminders";
import Help from "./commands/Help";

const ping = new Ping();
const single = new CreateSingle();
const repeating = new CreateRepeating();
const listReminders = new ListReminders();
const help = new Help();

export const commandList: Command[] = [
    ping,
    single,
    repeating,
    listReminders,
    help,
];
