const { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageActionRow } = require('discord.js');

module.exports = {
    name: 'buttonRole',
    description: 'Assign roles using buttons.',
    async execute(message, args) {
        const roles = {
            'Gamer': '🎮', // Role: Gamer -> Emoji: 🎮
            'Student': '📚', // Role: Student -> Emoji: 📚
        };

        // Create buttons
        const row = new ActionRowBuilder();
        for (const role of Object.keys(roles)) {
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(role) // This will be used to identify which role was clicked
                    .setLabel(role) // The label on the button
                    .setStyle(ButtonStyle.Primary) // Primary button style
            );
        }

        // Create an embed message
        const embed = {
            title: 'Click a button to get a role!',
            description: 'Choose a role by clicking one of the buttons below!',
            color: parseInt('0x0099ff', 16),
        };

        // Send the embed with the buttons
        await message.channel.send({ embeds: [embed], components: [row] });

        // Log that the button role message was sent
        console.log(`Sent button role assignment message in ${message.guild.name} (#${message.channel.name})`);
    },
};
