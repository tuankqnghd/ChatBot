require("dotenv").config();
const { Client, GatewayIntentBits, GuildPremiumTier} = require("discord.js");
const axios = require("axios");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,

    ],
});

client.on('ready', () => {
    console.log('Bot is online.');
});

client.on("guildCreate", (guild) => {
    const channel = guild.channels.cache.find(channel => channel.name === "general");
    if (channel) {
        channel.send(`Hello everyone! I'm now in this server.`);
    }
});

client.on("presenceUpdate", (oldPresence, newPresence) => {
    const { guild, user } = newPresence;
    const channel = guild.channels.cache.find(channel => channel.name === "general");
    if (channel && user.bot && oldPresence.status !== "online" && newPresence.status === "online") {
        channel.send(`Hello everyone! I am online now!`);
    }
});

client.on('messageCreate', async (message) => {
    console.log(`[${message.author.tag}] ${message.content}`);
    if (message.author.bot) {
        return;
    }

    if ((message.content === "GPT") | (message.content === ".help")) {
        message.reply('Hello! I am a chat bot developed by <@476397893322801155>, integrated with open ai gpt to help you with your work. How can I assist you today?\nCommand list:\n.help\tSupport interface\n.\t\t\tChat GPT');
    }

    if (message.content === "hello") {
        message.reply('Hi there! How can I help you today?');
    }

    if (message.content.startsWith('.')) {
        const request_GPT = message.content.slice(1);
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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'
        }
        const requestBody = {
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": request_GPT}]
        }
        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', requestBody, { headers });
            const answer = response.data.choices[0].message.content;
            message.channel.send(answer);
        } catch (error) {
            console.error(error);
        }
    }
});

client.login(process.env.TOKEN);