const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const logger = require('./utils/logger');  // Import the logger

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent,] });

client.commands = new Collection();

// Load commands dynamically
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    logger.info(`Loaded command: ${command.name}`);
}



// Load events dynamically
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);

    // Log event loading
    logger.info(`Loading event: ${event.name}`);

    // Handle the event based on whether it should run once or continuously
    if (event.once) {
        client.once(event.name, (...args) => {
            logger.info(`Event triggered (once): ${event.name}`);
            event.execute(...args, client); // Execute event logic
        });
    } else {
        client.on(event.name, (...args) => {
            logger.info(`Event triggered: ${event.name}`);
            event.execute(...args, client); // Execute event logic
        });
    }
}

client.login(process.env.DISCORD_TOKEN)
    .then(() => {
        logger.info('Bot logged in successfully!');
    })
    .catch((error) => {
        logger.error(`Error logging in: ${error.message}`);
    });
