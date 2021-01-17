const cooldowns = new Set();

module.exports = {
	callback: ({ message }) => {
		if (cooldowns.has(message.author.id)) return message.channel.send(`SPAMMER DETECTED: ${cooldowns.has(message.author.id)}`);
		cooldowns.add(message.author.id);
		setTimeout(() => cooldowns.delete(message.author.id), 15000);
	},
};