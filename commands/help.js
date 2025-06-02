module.exports = {
    name: 'help',
    async execute({ message, client, config }) {
        // Get all command names from client.commands
        const commandList = client.commands.map(cmd => `\`${config.prefix}${cmd.name}\``).join('\n');

        // Send the help message
        const sent = await message.channel.send(\n${commandList});

        // Delete both the user's message and the help message after 5 seconds
        setTimeout(() => {
            message.delete().catch(() => {});
            sent.delete().catch(() => {});
        }, 5000);
    }
};
