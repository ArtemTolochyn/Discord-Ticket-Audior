const fs = require("fs");
const { Client, GatewayIntentBits } = require('discord.js');
const {EventHandler} = require("./events/eventHandler");

const eventHandler = EventHandler;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ],
});


const configFile = fs.readFileSync('config.json', 'utf8');

const config = JSON.parse(configFile)

eventHandler.listen(client, config)


client.login(config['token']);