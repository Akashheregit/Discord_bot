const logger = require('../utils/logger');  // Import logger

module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction, user) {
        try {
            if (user.bot) return; // Ignore bot reactions

            const fs = require('fs');
            const roleData = JSON.parse(fs.readFileSync('./config/roleMessage.json', 'utf8'));

            if (reaction.message.id !== roleData.messageId) return;

            const roleName = roleData.roles[reaction.emoji.name];
            if (!roleName) return;

            const guild = reaction.message.guild;
            const member = await guild.members.fetch(user.id);
            const role = guild.roles.cache.find(r => r.name === roleName);

            if (role) {
                await member.roles.add(role);
                logger.info(`${user.username} added the ${roleName} role.`);
                user.send(`You have been assigned the **${roleName}** role.`);
            }
        } catch (error) {
            logger.error(`Error in messageReactionAdd: ${error.message}`);
        }
    },
};
