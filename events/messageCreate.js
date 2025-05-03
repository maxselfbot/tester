const fs = require('fs');
const configPath = './config.json';

module.exports = {
    name: 'messageCreate',
    async execute(client, message) {
        client.loadConfig();
        const config = client.config;

        if (!message.author || message.author.bot) return;

        const authorId = message.author.id;
        const content = message.content.trim();
        const isAllowedUser = config.allowed_users.includes(authorId);

        // --- Auto-react logic
        if (authorId !== client.user.id) {
            for (const entry of config.auto_react_users || []) {
                if (authorId === entry.id) {
                    try {
                        await message.react(entry.emoji);
                        console.log(`[REACT] Reacted to ${message.author.username} with ${entry.emoji}`);
                    } catch (err) {
                        console.error(`[ERROR] Reacting: ${err.message}`);
                    }
                }
            }
        }

 // --- Copycat logic
if (
    config.copycat_users &&
    config.copycat_users.includes(authorId) &&
    authorId !== client.user.id // ✅ Prevent copying itself
) {
    try {
        await message.channel.send({
            content: content,
            reply: { messageReference: message.id }
        });
        console.log(`[COPYCAT] Replied to ${message.author.username}: ${content}`);
    } catch (err) {
        console.error(`[ERROR] Copycat: ${err.message}`);
    }
}

        // --- Autoresponder (plain message)
        if (config.autoresponders && config.autoresponders[content]) {
            await message.channel.send(config.autoresponders[content]);
            setTimeout(() => {
                message.delete().catch(() => {});
            }, 500);
            return;
        }

        if (!isAllowedUser) return;

        // --- Command parsing (prefix optional)
        let commandName, args;

        const isPrefixed = content.startsWith(config.prefix);
        const parts = isPrefixed
            ? content.slice(config.prefix.length).trim().split(/\s+/)
            : content.split(/\s+/);

        commandName = parts.shift()?.toLowerCase();
        args = parts;

        // --- Built-in command: setauto
        if (commandName === 'setauto') {
            const key = args[0];
            const value = args.slice(1).join(' ');

            if (!key || !value) {
                return message.channel.send('Usage: .setauto <keyword> <response>');
            }

            config.autoresponders = config.autoresponders || {};
            config.autoresponders[key] = value;
            fs.writeFileSync(configPath, JSON.stringify(config, null, 4));

            return message.channel.send(`Auto-response set for **${key}** ✅`);
        }

        // --- Command execution
        const command = client.commands.get(commandName);
        if (!command) return;

        try {
            await command.execute({
                client,
                message,
                args,
                config,
                saveConfig: client.saveConfig
            });
            console.log(`[COMMAND] ${commandName} executed by ${message.author.tag}`);
        } catch (err) {
            console.error(`[ERROR] Command '${commandName}':`, err);
            message.channel.send(`Error: ${err.message}`);
        }
    }
};
