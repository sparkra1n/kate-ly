import { CommandInteraction, Client, Interaction, CommandInteractionOptionResolver } from "discord.js";
import { Commands } from "../Commands";
import InteractionLogger from "../utilities/InteractionLogger";

export default (client: Client, interactionLogger: InteractionLogger): void => {
  client.on("interactionCreate", async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;
    await handleSlashCommand(client, interaction as CommandInteraction, interactionLogger);
  });
};

const handleSlashCommand = async (client: Client, interaction: CommandInteraction, interactionLogger: InteractionLogger): Promise<void> => {
  const slashCommand = Commands.find((c) => c.data.name === interaction.commandName);
  if (!slashCommand) {
    await interaction.reply({
      content: "An error has occurred",
      ephemeral: true,
    });
    return;
  }

  await interactionLogger.logInteraction(interaction);
  await interaction.deferReply();
  const options = interaction.options as CommandInteractionOptionResolver;
  await slashCommand.execute(client, interaction, options);
};
