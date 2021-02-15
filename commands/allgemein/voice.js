const customsMain = require('../schemas/customs-main');

module.exports = {
	callback: async ({ message, args }) => {
		const { author, channel, guild } = message;

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
			channel.updateOverwrite(author, { VIEW_CHANNEL: true });
			channel.updateOverwrite('255741114273759232', { VIEW_CHANNEL: false });
			channel.send('Nur noch die User, denen du Rechte gegeben hast, können auf diesen Kanal zugreifen.');
		}
		else if (args[0] === 'unlock') {
			channel.updateOverwrite('255741114273759232', { VIEW_CHANNEL: true });
			channel.send('Alle User können jetzt auf diesen Kanal zugreifen.');
		}
		else if (args[0] === 'name') {
			if(!args[1]) return message.reply('versuche es so: `!voice name <name>`');
			channel.setName(args[1]);
			channel.send(`Der Name des Kanals wurde geändert. Neuer Name: \`${args[1]}\`.`);
		}
		else if (args[0] === 'reject') {
			if(!args[1]) return message.reply('versuche es so: `!voice reject <@user>`');
			const mention = args[1].toString().replace('<@!', '');
			const mentionId = mention.toString().replace('>', '');
			channel.updateOverwrite(mentionId, { VIEW_CHANNEL: false });
			channel.send(`Du hast <@${mentionId}> den Zugriff auf diesen Kanal verweigert.`);
		}
		else if (args[0] === 'permit') {
			if(!args[1]) return message.reply('versuche es so: `!voice permit <@user>');
			const mention = args[1].toString().replace('<@!', '');
			const mentionId = mention.toString().replace('>', '');
			channel.updateOverwrite(mentionId, { VIEW_CHANNEL: true });
			channel.send(`Du hast <@${mentionId}> Zugriff auf diesen Kanal gegeben.`);
		}
		else if (args[0] === 'limit') {
			message.reply('coming soon');
		}
	},
};