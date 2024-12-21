const { MessageEmbed } = require('discord.js');
const logger = require('../utils/logger');  // Import the logger

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

            // Send the embed message
            const roleMessage = await message.channel.send({ embeds: [embed] });
            logger.info(`Sent emoji role assignment message in ${message.guild.name} (#${message.channel.name}).`);

            // React with each emoji
            for (const emoji of Object.keys(roles)) {
                await roleMessage.react(emoji);
                logger.info(`Reacted with emoji: ${emoji}`);
            }

            // Handle reactions
            const filter = (reaction, user) => {
                return Object.keys(roles).includes(reaction.emoji.name) && !user.bot;
            };

            const collector = roleMessage.createReactionCollector({ filter, dispose: true });

            collector.on('collect', async (reaction, user) => {
                const roleName = roles[reaction.emoji.name];
                const role = message.guild.roles.cache.find(r => r.name === roleName);

                if (role) {
                    const member = await message.guild.members.fetch(user.id);
                    if (!member.roles.cache.has(role.id)) {
                        await member.roles.add(role);
                        logger.info(`Assigned ${roleName} role to ${user.tag}`);
                    }
                }
            });

            collector.on('remove', async (reaction, user) => {
                const roleName = roles[reaction.emoji.name];
                const role = message.guild.roles.cache.find(r => r.name === roleName);

                if (role) {
                    const member = await message.guild.members.fetch(user.id);
                    if (member.roles.cache.has(role.id)) {
                        await member.roles.remove(role);
                        logger.info(`Removed ${roleName} role from ${user.tag}`);
                    }
                }
            });

            // Store the data to a JSON file (if needed for further management)
            const fs = require('fs');
            const roleMessageData = {
                messageId: roleMessage.id,
                roles,
            };
            fs.writeFileSync('./config/roleMessage.json', JSON.stringify(roleMessageData, null, 2));
            logger.info('Role message data saved successfully.');
        } catch (error) {
            logger.error(`Error in emojiRole command: ${error.message}`);
        }
    },
};
