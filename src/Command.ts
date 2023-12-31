import { CommandInteraction, Client, CommandInteractionOptionResolver } from "discord.js";

export interface Command {
  data: {
    name: string;
    description: string;
    options?: ApplicationCommandOption[];
  };
  execute: (client: Client, interaction: CommandInteraction, args: CommandInteractionOptionResolver) => Promise<void>;
}

export interface ApplicationCommandOption {
  type: number;
  name: string;
  description: string;
  required?: boolean;
  choices?: { name: string; value: string | number }[];
}

export default Command;