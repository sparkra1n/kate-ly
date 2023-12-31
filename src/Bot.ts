import { Client, ClientOptions } from "discord.js";
import ready from "./listeners/Ready";
import createInteraction from "./listeners/CreateInteraction";
import { BOT_TOKEN } from "./config/Config";

console.log("Bot is starting...");

const client = new Client({ intents: ['Guilds', 'GuildMessages'] });

ready(client);
createInteraction(client);
client.login(BOT_TOKEN);
