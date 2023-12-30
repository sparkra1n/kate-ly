import { Client, CommandInteraction } from "discord.js";
import { Commands } from "../Commands";

export default (client: Client): void => {
  client.on("ready", async () => {
    if (!client.user || !client.application) {
      return;
    }

    // Convert your custom Command objects to ApplicationCommandDataResolvable
    const commandsData = Commands.map((command) => ({
      name: command.data.name,
      description: command.data.description,
      options: command.data.options,
    }));

    await client.application.commands.set(commandsData);

    console.log(`${client.user.username} is online`);
  });
};
