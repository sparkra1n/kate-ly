import { CommandInteraction, Client } from "discord.js";
import { Command } from "../Command";

export const Hello: Command = {
  data: {
    name: "hello",
    description: "Returns a greeting"
  },
  async execute(client: Client, interaction: CommandInteraction) {
    const content = "Hello there!";
    await interaction.editReply({
      content
    });
  }
};