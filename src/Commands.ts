import { Command } from "./Command";
import { Ask } from "./commands/Ask";
import { Chehalis } from "./commands/Chehalis";
import { GenInpoa } from "./commands/GenInpoa";
import { Hello } from "./commands/Hello";
import { HeritageUnits } from "./commands/HeritageUnits";

export const Commands: Command[] = [
    Hello, 
    HeritageUnits,
    GenInpoa,
    Ask,
    Chehalis
];