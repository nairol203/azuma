const test = require('../../features/cooldowns');

module.exports = {
	callback: async ({ message }) => {
		const getCd = await test.getCooldown(message.author.id, 'test');
		if (!getCd) {
			await test.setCooldown(message.author.id, 'test', 60);
		}
		else {
			message.reply('cooldown!');
			return;
		}
		message.reply('der Test war erfolgreich!');
	},
};