const customsMain = require('../schemas/customs-main');

module.exports = {
	callback: async ({ message, args }) => {
		const { guild } = message;

		if(args[0] === 'setup') {
			const customChannel = await guild.channels.create('Customs', {
				type: 'voice',
			});
			const channelId = customChannel.id;
			const uploadChannel = await customsMain.insertMany(
				{
					channelId,
				},
			);
			return;
		}
		else if (args[0] === 'lock') {
			message.reply('coming soon');
		}
		else if (args[0] === 'unlock') {
			message.reply('coming soon');
		}
		else if (args[0] === 'name') {
			message.reply('coming soon');
		}
		else if (args[0] === 'reject') {
			message.reply('coming soon');
		}
		else if (args[0] === 'permit') {
			message.reply('coming soon');
		}
		else if (args[0] === 'limit') {
			message.reply('coming soon');
		}
	},
};