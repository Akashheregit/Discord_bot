const { MessageEmbed } = require('discord.js');
const logger = require('../utils/logger');  // Import logger

module.exports = {
    name: 'emojiRole',
    description: 'Assign roles using emojis.',
    async execute(message, args) {
        try {
            // Roles and corresponding emojis
            const roles = {
                '🎮': 'Gamer',
                '📚': 'Student',
            };

            // Create the embed message
            const embed = new MessageEmbed()
                .setTitle('React to get a role!')
                .setDescription(
                    Object.entries(roles)
                        .map(([emoji, role]) => `${emoji} - ${role}`)
                        .join('\n')
                )
                .setColor('#0099ff');

            // Send the embed
            const roleMessage = await message.channel.send({ embeds: [embed] });
            logger.info(`Sent emoji role assignment message in ${message.guild.name} (#${message.channel.name}).`);

            // React with each emoji
            for (const emoji of Object.keys(roles)) {
                await roleMessage.react(emoji);
                logger.info(`Reacted with emoji: ${emoji}`);
            }

            // Store the message ID and role data for handling reactions
            const roleMessageData = {
                messageId: roleMessage.id,
                roles,
            };

            // Save the data to a JSON file
            const fs = require('fs');
            fs.writeFileSync('./config/roleMessage.json', JSON.stringify(roleMessageData, null, 2));

            logger.info('Role message data saved successfully.');
        } catch (error) {
            logger.error(`Error in emojiRole command: ${error.message}`);
        }
    },
};
