import { Client, CommandInteraction, CommandInteractionOptionResolver, ActionRowBuilder, ButtonBuilder } from "discord.js";
import { Command, ApplicationCommandOption } from "../Command";

export type ButtonNavigatorCallback = (
  data: any, 
  currentIndex: number, 
  dataLength: number, 
  interaction: CommandInteraction,
  args?: any[]
) => void;

export default class ButtonNavigatorCommand implements Command {
  data: {
    name: string;
    description: string;
    options?: ApplicationCommandOption[];
  };

  private readonly name: string;
  private readonly description: string;
  private readonly options?: ApplicationCommandOption[];
  private readonly dataArray: any[];
  private readonly buttonCallback: ButtonNavigatorCallback;
  private readonly interaction: CommandInteraction;
  private readonly args: any[];

  constructor(name: string, 
              description: string, 
              dataArray: any[], 
              buttonCallback: ButtonNavigatorCallback, 
              interaction: CommandInteraction, 
              args?: any,
              options?: ApplicationCommandOption[]) {
    this.name = name;
    this.description = description;
    this.options = options || [];
    this.dataArray = dataArray;
    this.buttonCallback = buttonCallback;
    this.interaction = interaction;
    this.args = args;
    this.data = {
      name: this.name,
      description: this.description,
      options: this.options,
    };
  }

  private createActionRow(): ActionRowBuilder<ButtonBuilder> {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId("left").setLabel("<").setStyle(1),
      new ButtonBuilder().setCustomId("right").setLabel(">").setStyle(1),
      new ButtonBuilder().setCustomId("close").setLabel("x").setStyle(4)
    );
  }

  async execute(client: Client, interaction: CommandInteraction, args: CommandInteractionOptionResolver): Promise<void> {
    let currentIndex = 0;
    // const dataArray = ["one", "two", "three"];

    if (!interaction.channel) {
      console.error("Channel is not available.");
      return;
    }

    const row = this.createActionRow();

    const message = await interaction.editReply({
      // content: this.dataArray[currentIndex],
      components: [row],
    });

    const filter = (buttonInteraction: { customId: string }) =>
      ["left", "right", "close"].includes(buttonInteraction.customId);

    const collector = message.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    this.buttonCallback(this.dataArray[currentIndex], currentIndex, this.dataArray.length, this.interaction, this.args);

    collector.on("collect", async (buttonInteraction) => {
      if (buttonInteraction.user.id === interaction.user.id) {
        switch (buttonInteraction.customId) {
          case "left":
            currentIndex =
              (currentIndex - 1 + this.dataArray.length) % this.dataArray.length;
            break;
          case "right":
            currentIndex = (currentIndex + 1) % this.dataArray.length;
            break;
          case "close":
            break;
        }
        this.buttonCallback(this.dataArray[currentIndex], currentIndex, this.dataArray.length, this.interaction, this.args);

        /* If no change happens for each interaction, Discord says "this interaction failed"
         * The setTimeout is to ensure that the message does not get cancelled by the rate limit.
         */
        setTimeout(async () => {
          await buttonInteraction.update({
            components: buttonInteraction.customId === "close" ? [] : [row],
          });
        }, 500);
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
