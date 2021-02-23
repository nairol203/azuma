const rarefish = require('../../features/rarefish');

module.exports = {
	expectedArgs: '',
	requiredPermissions: ['ADMINISTRATOR'],
	callback: async ({ message, args }) => {
		const userId = message.author.id;
		await rarefish.setDefault(userId);
		message.channel.send('Default Schema saved to db');
	},
};