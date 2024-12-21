const logger = require('../utils/logger');  // Import logger

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        try {
            if (!interaction.isButton()) return; // Ensure the interaction is a button interaction

            const roleName = interaction.customId;
            const guild = interaction.guild;
            const member = await guild.members.fetch(interaction.user.id);

            // Check if the role exists in the guild
            let role = guild.roles.cache.find(r => r.name === roleName);

            if (!role) {
                // If the role doesn't exist, create it
                try {
                    role = await guild.roles.create({
                        name: roleName,
                        color: parseInt('0x0099ff', 16), // You can change the color to a specific value
                        reason: `Role created automatically for button interaction: ${roleName}`,
                    });

                    await interaction.reply({
                        content: `The **${roleName}** role didn't exist, so it has been created and assigned to you.`,
                        ephemeral: true
                    });
                    logger.info(`${interaction.user.username} triggered role creation for ${roleName}.`);
                } catch (error) {
                    logger.error(`Error creating role: ${error.message}`);
                    return interaction.reply({ content: 'There was an error creating the role.', ephemeral: true });
                }
            }

            // Now that we have the role (whether created or fetched), check if the member has it
            if (member.roles.cache.has(role?.id)) {
                await member.roles.remove(role);
                await interaction.reply({
                    content: `Removed the **${roleName}** role from you!`,
                    ephemeral: true
                });
                logger.info(`${interaction.user.username} removed the ${roleName} role via button interaction.`);
            } else {
                await member.roles.add(roleName);
                await interaction.reply({
                    content: `You have been assigned the **${roleName}** role!`,
                    ephemeral: true
                });
                logger.info(`${interaction.user.username} added the ${roleName} role via button interaction.`);
            }
        } catch (error) {
            logger.error(`Error in interactionCreate: ${error.message}`);
            await interaction.reply({ content: 'An error occurred while processing the interaction.', ephemeral: true });
        }
    },
};
