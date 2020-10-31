import Command from "./commands/command";
import Help from "./commands/Help";
import Ping from "./commands/ping";
import CreateSingle from "./commands/CreateSingle";
import CreateRepeating from "./commands/CreateRepeating";
import ListReminders from "./commands/ListReminders";
import Delete from "./commands/Delete";
import Suspend from "./commands/Suspend";

const help = new Help();
const ping = new Ping();
const single = new CreateSingle();
const repeating = new CreateRepeating();
const listReminders = new ListReminders();
const deleter = new Delete();

export const commandList: Command[] = [
    ping,
    single,
    repeating,
    listReminders,
    deleter,
    help,
];
