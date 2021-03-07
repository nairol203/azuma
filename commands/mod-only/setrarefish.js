const fish_rarefish = require('../../features/fish_rarefish');

module.exports = {
	requiredPermissions: ['ADMINISTRATOR'],
	callback: async ({ message }) => {
		const userId = message.author.id;
		await fish_rarefish.setDefault(userId);
		message.channel.send('Default Schema saved to db');
	},
};