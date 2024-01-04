import { Client, CommandInteraction, CommandInteractionOptionResolver, EmbedBuilder } from "discord.js";
import Command from "../Command";

export const Ask: Command = {
  data: {
    name: "ask",
    description: "Randomly answers yes/no",
    options: [
      {
        type: 3,
        name: "question",
        description: "e.g., are Thundercabs good?",
        required: true,
      },
    ],
  },
  async execute(client: Client, interaction: CommandInteraction, args: CommandInteractionOptionResolver) {
    const randomResponse = getRandomResponse();
    const embed = new EmbedBuilder()
    .setTitle("Ask")
    .setDescription(args.getString("question") ?? "?")
    .setColor([65, 79, 107])
    .addFields({ name: "Answer", value: randomResponse })

    await interaction.editReply({
      embeds: [embed]
    });
  }
};

function getRandomResponse() {
  const responses = [
    "No",
    "Yes",
    "Maybe",
    "Definitely not",
    "Ask later",
    "Nope",
    "Yep",
    "Yeah",
    "Definitely",
    "Of Course",
    "I'm not answering THAT",
    "Probably yes",
    "Definitely yes",
    "Absolutely",
    "Yep",
    "Yeah",
    "Absolutely yes",
    "YES!!!",
    "Maybe not",
    "Absolutely not",
    "Of course not",
    "NOOOOO!!!",
    "No No No",
    "Obviously not"
  ];

  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
}