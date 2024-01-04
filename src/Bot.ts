import { Client, ClientOptions } from "discord.js";
import ready from "./listeners/Ready";
import createInteraction from "./listeners/CreateInteraction";
import { BOT_TOKEN } from "./utilities/Config";
import InteractionLogger from "./utilities/InteractionLogger";

console.log("Bot is starting...");
const interactionLogger = new InteractionLogger("./logs/UserIDs.json");
const client = new Client({ intents: ['Guilds', 'GuildMessages'] });

ready(client);
createInteraction(client, interactionLogger);
client.login(BOT_TOKEN);
