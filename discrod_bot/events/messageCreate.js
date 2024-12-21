module.exports = {
    name: 'messageCreate',
    execute(message, client) {
        // Ignore messages from bots
        if (message.author.bot) return;

        // Define a prefix for commands
        const prefix = '!';

        // Check if the message starts with the prefix
        if (!message.content.startsWith(prefix)) return;

        // Split the message into command and arguments
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift()

        // Check if the command exists
        const command = client.commands.get(commandName);
        if (!command) return;

        // Execute the command
        try {
            command.execute(message, args);
        } catch (error) {
            console.error(`Error executing command ${commandName}: ${error.message}`);
            message.reply('There was an error while executing that command!');
        }
    },
};
