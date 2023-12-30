import { CommandInteraction, Client, CommandInteractionOptionResolver } from "discord.js";
import { Command, ApplicationCommandOption } from "../Command";

export const Hello2: Command = {
  data: {
    name: "hello2",
    description: "Returns a greeting 2",
    options: [
      {
        type: 3, // type 3 represents a string
        name: "name", // the name of the parameter
        description: "The name to greet",
        required: true // set to true if the parameter is required
      }
    ]
  },
  async execute(client: Client, interaction: CommandInteraction, args: CommandInteractionOptionResolver) {
    const name = args.getString("name");
    const content = `Hello ${name} 2!`;

    await interaction.editReply({
      content
    });
  }
};
