const { Client, Collection } = require('discord.js-selfbot-v13');
const fs = require('fs');

const CONFIG_FILE = 'config.json';

function loadConfig() {
    try {
        const data = JSON.parse(fs.readFileSync(CONFIG_FILE));
        if (!data.autoresponders) data.autoresponders = {};
        return data;
    } catch (err) {
        console.error("Failed to load config.json:", err);
        process.exit(1);
    }
}

function saveConfig(config) {
    try {
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 4));
    } catch (err) {
        console.error("Failed to save config.json:", err);
    }
}

const config = loadConfig();
const client = new Client();
client.commands = new Collection();
client.config = config;
client.saveConfig = () => saveConfig(client.config);
client.loadConfig = () => { client.config = loadConfig(); };

// Load commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Load events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    client.on(event.name, (...args) => event.execute(client, ...args));
}

client.on('ready', () => {
    console.log(`[READY] Logged in as ${client.user.username} (${client.user.id})`);
});

client.login(config.token).catch(err => {
    console.error("[ERROR] Login failed:", err.message);
    process.exit(1);
});
