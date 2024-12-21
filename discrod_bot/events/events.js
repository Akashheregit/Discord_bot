module.exports = {
    name: 'ready',
    once: true, // Set to true if the event should only run once
    execute(client) {
        console.log(`Logged in as ${client.user.tag}!`);
    },
};
