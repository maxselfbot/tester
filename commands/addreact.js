module.exports = {
    name: 'addreact',
    async execute({ message, args, config, saveConfig }) {
        if (message.mentions.users.size === 0) return message.channel.send("Mention a user.");
        const mention = message.mentions.users.first();
        const emoji = args[args.length - 1];
        if (config.auto_react_users.some(u => u.id === mention.id)) {
            return message.channel.send(```User already in auto-react list.```);
        }
        config.auto_react_users.push({ id: mention.id, emoji });
        saveConfig(config);
        await message.channel.send(```Now reacting to ${mention.username} with ${emoji}```);
    }
};
