import { Client, CommandInteraction, CommandInteractionOptionResolver, ActionRowBuilder, ButtonBuilder } from "discord.js";
import { Command, ApplicationCommandOption } from "../Command";

export default class ButtonCommand implements Command {
  data: {
    name: string;
    description: string;
    options?: ApplicationCommandOption[];
  };

  private readonly name: string;
  private readonly description: string;
  private readonly options?: ApplicationCommandOption[];

  constructor(name: string, description: string, options?: ApplicationCommandOption[]) {
    this.name = name;
    this.description = description;
    this.options = options || [];

    this.data = {
      name: this.name,
      description: this.description,
      options: this.options,
    };
  }

  private createActionRow(): ActionRowBuilder<ButtonBuilder> {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId("left").setLabel("Left").setStyle(1),
      new ButtonBuilder().setCustomId("right").setLabel("Right").setStyle(1),
      new ButtonBuilder().setCustomId("close").setLabel("Close").setStyle(4)
    );
  }

  async execute(client: Client, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void> {
    let currentIndex = 0;
    const dataArray = ["one", "two", "three"];

    if (!interaction.channel) {
      console.error("Channel is not available.");
      return;
    }

    const row = this.createActionRow();

    const message = await interaction.editReply({
      content: dataArray[currentIndex],
      components: [row],
    });

    const filter = (buttonInteraction: { customId: string }) =>
      ["left", "right", "close"].includes(buttonInteraction.customId);

    const collector = message.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    collector.on("collect", async (buttonInteraction: any) => {
      if (buttonInteraction.user.id === interaction.user.id) {
        switch (buttonInteraction.customId) {
          case "left":
            currentIndex =
              (currentIndex - 1 + dataArray.length) % dataArray.length;
            break;
          case "right":
            currentIndex = (currentIndex + 1) % dataArray.length;
            break;
          case "close":
            break;
        }

        await buttonInteraction.update({
          content: dataArray[currentIndex],
          components: buttonInteraction.customId === "close" ? [] : [row],
        });
      }
    });

    collector.on("end", (collected: any, reason: any) => {
      // Edit the original message to remove the action row with buttons
      message.edit({
        components: [],
      });
    });
  }
}

export const Hello2 = new ButtonCommand("button", "test");
