import { Client, CommandInteraction, EmbedBuilder } from "discord.js";
import axios, { AxiosResponse } from 'axios';
import { DateTime } from 'luxon';
import Command from "../Command";
import ButtonNavigatorCommand, { ButtonNavigatorCallback } from "../ButtonNavigator";

type Data = {
  timestamp: string;
  direction: string;
  railroad: string;
  trainNumber: string;
  power: string;
  notes: string;
};

const chehalisCallback: ButtonNavigatorCallback = async (
  data: Data,
  currentIndex: number,
  dataLength: number,
  interaction: CommandInteraction,
  args: any
) => {
  const embed = new EmbedBuilder()
  .setTitle("Chehalis RailCam")
  .setColor([65, 79, 107])
  .addFields(
    {
      name: "Timestamp",
      value: data.timestamp,
    },
    {
      name: "Direction",
      value: data.direction,
    },
    {
      name: "Ralroad",
      value: data.railroad,
    },
    {
      name: "Train Number",
      value: data.trainNumber,
    },
    {
      name: "Power",
      value: data.power,
    },
    {
      name: "Notes",
      value: data.notes,
    }
  )
  .setFooter({
    text: `Page ${currentIndex + 1} of ${dataLength}`
  });
  await interaction.editReply({
    embeds: [embed]
  });
};

export const Chehalis: Command = {
  data: {
    name: "chehalis",
    description: "Browse Chehalis RailCam reports"
  },
  async execute(client: Client, interaction: CommandInteraction) {
    const result = await fetchSpreadsheetData();
    if (!result) {
      console.error("Error fetching Chehalis spreadsheet");
      return;
    }
    
    const data = extractSpreadsheetData(result);
    const buttonNavigator = new ButtonNavigatorCommand(data, chehalisCallback, interaction);

    // Execute the button navigator
    await buttonNavigator.execute(client, interaction);
  }
};

function extractSpreadsheetData(rawData: string) {
  const result: Data[] = [];

  // Put placeholders for the commas that are not csv commas
  rawData = rawData.replaceAll(", ", "%c"); 

  // Skip header rows
  const dataRows = rawData.split('\r\n').slice(2); 

  for (const row of dataRows) {
    // Split the row into cells
    let data = row.split(",").map((item) => item.trim());

    // Clean up random quotes and bring back wanted commas
    data = data.map((item) => item.replaceAll("\"", "").replaceAll("%c", ", "));

    // Skip incomplete rows
    if (!data[0] || !data[1] || !data[2] || !data[3] || !data[4] || !data[6] || !data[7]) 
      continue;

    result.push({
      timestamp: `${data[2]}`,
      direction: data[3],
      railroad: data[4],
      trainNumber: `${data[5]} (${data[6]})`,
      power: data[7],
      notes: data[10] || "None"
    });
  }
  return result;
}

const fetchSpreadsheetData = async (): Promise<string | undefined> => {
  try {
    const response: AxiosResponse = await axios.get(
      'https://docs.google.com/spreadsheet/ccc?key=1ke0YQqnn6qD6wwaiIShpXnHBChZjrLiWSzsPtlNBybA&output=csv'
    );

    if (response.status !== 200) 
      return 'Connection Error';

    const responseData = response.data;
    return responseData;
  } catch (error) {
    console.error('Error:', error);
    return 'Unknown Error';
  }
};

function generateYouTubeLink(startTime: string): string | null {
  const videoId = 'G8VEdEPmFiE';
  console.log(startTime);
  const startTimeFormatted = DateTime.fromFormat(startTime, "hh:mm", { zone: "America/Los_Angeles" });
  console.log(startTimeFormatted);
  // Too much time has passed
  // if (DateTime.local() > startTimeFormatted.plus({ minutes: 30 })) {
  //   return null;
  // }

  return `https://www.youtube.com/watch?v=${videoId}&t=${startTimeFormatted.diffNow().as("seconds")}`;
}


function printWithEscapeSequences(input: string): void {
  if (!input)
    return;
  const escapedString = input
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/\v/g, '\\v')
    .replace(/\f/g, '\\f');

  console.log(escapedString);
}