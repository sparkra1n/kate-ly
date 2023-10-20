import { CommandInteraction, Client, Interaction, CommandInteractionOptionResolver } from "discord.js";
import { Commands } from "../Commands";

export default (client: Client): void => {
  client.on("interactionCreate", async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;
    await handleSlashCommand(client, interaction as CommandInteraction);
  });
};

const handleSlashCommand = async (client: Client, interaction: CommandInteraction): Promise<void> => {
  const slashCommand = Commands.find((c) => c.data.name === interaction.commandName);
  if (!slashCommand) {
    await interaction.reply({
      content: "An error has occurred",
      ephemeral: true,
    });
    return;
  }

  await interaction.deferReply();
  const options = interaction.options as CommandInteractionOptionResolver;
  await slashCommand.execute(client, interaction, options);
};
