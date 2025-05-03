const fs = require('fs');
const configPath = './config.json';

module.exports = {
    name: 'copycat',
    async execute({ message, args, config, saveConfig }) {
        const target = args[0];
        if (!target) return message.channel.send("Usage: !copycat <user_id>");

        const userId = target.replace(/[<@!>]/g, ''); // Clean if mention

        config.copycat_users = config.copycat_users || [];

        const index = config.copycat_users.indexOf(userId);
        if (index === -1) {
            config.copycat_users.push(userId);
            fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
            message.channel.send(`🔁 Now copying messages from <@${userId}>`);
        } else {
            config.copycat_users.splice(index, 1);
            fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
            message.channel.send(`❌ Stopped copying <@${userId}>`);
        }
    }
};
