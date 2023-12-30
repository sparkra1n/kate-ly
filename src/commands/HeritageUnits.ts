import {
  CommandInteraction,
  Client,
  CommandInteractionOptionResolver,
  EmbedBuilder,
  Embed,
} from "discord.js";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import qs from "qs";
import { Command } from "../Command";

interface DataElement {
  Id: number;
  SpottedOn: string;
  SpottedOn2: string;
  Direction: string;
  Train: string | null;
  Leading: string;
  Location: string;
  SpotterScore: string;
  VisualId: number;
  Visual: string;
  SpotterHandle: string;
}

export const HeritageUnits: Command = {
  data: {
    name: "heritageunits",
    description: "Browse locomotive spottings on heritageunits.com",
    options: [
      {
        type: 3,
        name: "hu",
        description: "Heritage unit, e.g., up1988",
        required: true,
      },
    ],
  },
  async execute(
    client: Client,
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
  ) {
    const locomotive = args.getString("hu")?.toUpperCase() ?? "";
    const response: string | null = await getLocomotiveData(locomotive);

    if (!response || typeof response !== "object" || !("data" in response)) {
      await interaction.editReply({
        content: "Invalid ID!",
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("Heritage Unit")
      .setDescription(`Location of ${locomotive}`)
      .setColor([65, 79, 107])
      .addFields(
        {
          name: "Date",
          value: response["data"][0]["SpottedOn"] ?? "Unknown",
          inline: true,
        },
        {
          name: "Last seen at",
          value: response["data"][0]["Location"] ?? "Unknown",
          inline: true,
        },
        {
          name: "Train number",
          value: response["data"][0]["Train"] ?? "Unknown",
          inline: true,
        },
        {
          name: "Direction",
          value: response["data"][0]["Direction"] ?? "None",
          inline: true,
        },
        {
          name: "Leading",
          value: response["data"][0]["Leading"] ?? "Unknown",
          inline: true,
        },
        {
          name: "Visually seen",
          value: response["data"][0]["Visual"] ?? "Unknown",
          inline: true,
        }
      )
      .setFooter({
        text: `Spotted by ${response["data"][0]["SpotterHandle"] ?? "Unknown"}`
      });
    await interaction.editReply({
      embeds: [embed],
    });
  },
};

async function getLocomotiveData(
  locomotiveId: string,
  tzOffset: string = "0"
): Promise<string | null> {
  const url = `https://heritageunits.com/locomotive/detail/${locomotiveId}`;
  const headers = createHeaders();
  axios.defaults.headers.common = headers;

  try {
    const response = await axios.get(url);
    if (response.status !== 200) {
      console.error(`Something went wrong. ${response.status}`);
      return null;
    }

    const { data, verificationToken, antiForgeryToken } =
      processResponseData(response);

    if (antiForgeryToken) {
      headers["X-XSRF-Token"] = antiForgeryToken;
      headers["Cookie"] = `.hu.antiforgery=${antiForgeryToken}`;
    } else {
      console.error("Could not find antiForgeryToken");
      return null;
    }

    const payload = createPayload(data, tzOffset, verificationToken);

    const postConfig: AxiosRequestConfig = {
      method: "post",
      url: "https://heritageunits.com/locomotive/history/table",
      data: qs.stringify(payload),
      headers,
    };

    const postResponse = await axios(postConfig);
    return postResponse.data;
  } catch (error) {
    console.error(`Something went wrong. ${error}`);
    return null;
  }
}

function createHeaders() {
  return {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0",
    Accept: "application/json, text/javascript, */*; q=0.01",
    "Accept-Language": "en-US,en;q=0.5",
    Referer: "",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-XSRF-Token": "",
    "X-Requested-With": "XMLHttpRequest",
    Origin: "https://heritageunits.com",
    DNT: "1",
    Connection: "keep-alive",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "no-cors",
    "Sec-Fetch-Site": "same-origin",
    Pragma: "no-cache",
    "Cache-Control": "no-cache",
    TE: "trailers",
    Cookie: "",
  };
}

function processResponseData(response: AxiosResponse) {
  const responseText: string = response.data;
  const data: string = responseText
    .split("locomotiveView.init(")[1]
    .split(", false);")[0];
  const verificationToken: string = responseText
    .split('<input name="__RequestVerificationToken" type="hidden" value="')[1]
    .split('" />')[0];
  const setCookieHeader: string[] | undefined = response.headers["set-cookie"];
  let antiForgeryToken: string | undefined;

  if (setCookieHeader) {
    for (const cookie of setCookieHeader) {
      const match = cookie.match(/\.hu\.antiforgery=([^;]+)/);
      if (match) {
        antiForgeryToken = match[1];
        break;
      }
    }
  }

  return { data, verificationToken, antiForgeryToken };
}

function createPayload(
  data: string,
  tzOffset: string,
  verificationToken: string
) {
  return {
    draw: "1",
    "columns[0][data]": "SpottedOn2",
    "columns[0][name]": "",
    "columns[0][searchable]": "true",
    "columns[0][orderable]": "false",
    "columns[0][search][value]": "",
    "columns[0][search][regex]": "false",
    "columns[1][data]": "Location",
    "columns[1][name]": "",
    "columns[1][searchable]": "true",
    "columns[1][orderable]": "false",
    "columns[1][search][value]": "",
    "columns[1][search][regex]": "false",
    "columns[2][data]": "Direction",
    "columns[2][name]": "",
    "columns[2][searchable]": "true",
    "columns[2][orderable]": "false",
    "columns[2][search][value]": "",
    "columns[2][search][regex]": "false",
    "columns[3][data]": "Train",
    "columns[3][name]": "",
    "columns[3][searchable]": "true",
    "columns[3][orderable]": "false",
    "columns[3][search][value]": "",
    "columns[3][search][regex]": "false",
    "columns[4][data]": "Leading",
    "columns[4][name]": "",
    "columns[4][searchable]": "true",
    "columns[4][orderable]": "false",
    "columns[4][search][value]": "",
    "columns[4][search][regex]": "false",
    "columns[5][data]": "Visual",
    "columns[5][name]": "",
    "columns[5][searchable]": "true",
    "columns[5][orderable]": "false",
    "columns[5][search][value]": "",
    "columns[5][search][regex]": "false",
    "columns[6][data]": "SpotterScore",
    "columns[6][name]": "",
    "columns[6][searchable]": "true",
    "columns[6][orderable]": "false",
    "columns[6][search][value]": "",
    "columns[6][search][regex]": "false",
    start: "0",
    length: "-1",
    "search[value]": "",
    "search[regex]": "false",
    id: data,
    tzOffset: tzOffset,
    __RequestVerificationToken: verificationToken,
  };
}
