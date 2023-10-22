import { CommandInteraction, Client } from "discord.js";
import { Command } from "../Command";

export const Hello2: Command = {
  data: {
    name: "hello2",
    description: "Returns a greeting 2"
  },
  async execute(client: Client, interaction: CommandInteraction) {
    const content = "Hello there 2!";

    await interaction.editReply({
      content
    });
  }
};
