import Command from "./Commands/Command";
import Help from "./Commands/Help";
import Ping from "./Commands/ping";
import CreateSingle from "./Commands/CreateSingle";
import CreateRepeating from "./Commands/CreateRepeating";
import ListReminders from "./Commands/ListReminders";
import Delete from "./Commands/Delete";
import Mute from "./Commands/Mute";
import Suspend from "./Commands/Suspend";
import Push from "./Commands/Push";

const help = new Help();
const ping = new Ping();
const single = new CreateSingle();
const repeating = new CreateRepeating();
const listReminders = new ListReminders();
const deleter = new Delete();
const mute = new Mute();
const suspend = new Suspend();
const push = new Push();

export const commandList: Command[] = [
    ping,
    single,
    repeating,
    listReminders,
    deleter,
    mute,
    suspend,
    push,
    help,
];
