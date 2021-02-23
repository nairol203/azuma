const rarefish = require('../../features/rarefish');

module.exports = {
	requiredPermissions: ['ADMINISTRATOR'],
	callback: async ({ message }) => {
		const userId = message.author.id;
		await rarefish.setDefault(userId);
		message.channel.send('Default Schema saved to db');
	},
};