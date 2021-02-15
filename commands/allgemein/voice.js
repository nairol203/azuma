const customsMain = require('../../schemas/customs-main');
const customs = require('../../schemas/customs');

module.exports = {
	callback: async ({ message, args }) => {
		const { author, channel, guild } = message;
		const voiceChannel = message.member.voice.channel;
		const userId = author.id;
		const channelId = voiceChannel.id;

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
			voiceChannel.updateOverwrite(author, { VIEW_CHANNEL: true });
			voiceChannel.updateOverwrite('255741114273759232', { VIEW_CHANNEL: false });
			channel.send('Nur noch die User, denen du Rechte gegeben hast, können auf diesen Kanal zugreifen.');
		}
		else if (args[0] === 'unlock') {
			voiceChannel.updateOverwrite('255741114273759232', { VIEW_CHANNEL: true });
			channel.send('Alle User können jetzt auf diesen Kanal zugreifen.');
		}
		else if (args[0] === 'name') {
			if(!args[1]) return message.reply('versuche es so: `!voice name <name>`');
			voiceChannel.setName(args[1]);
			channel.send(`Der Name des Kanals wurde geändert. Neuer Name: \`${args[1]}\`.`);
			const channelName = args[1];
			const uploadChannelName = await customs.findOneAndUpdate(
				{
					userId,
					channelId,
				},
				{
					userId,
					channelId,
					channelName,
				},
			);
		}
		else if (args[0] === 'reject') {
			if(!args[1]) return message.reply('versuche es so: `!voice reject <@user>`');
			const mention = args[1].toString().replace('<@!', '');
			const mentionId = mention.toString().replace('>', '');
			voiceChannel.updateOverwrite(mentionId, { VIEW_CHANNEL: false });
			channel.send(`Du hast <@${mentionId}> den Zugriff auf diesen Kanal verweigert.`);
		}
		else if (args[0] === 'permit') {
			if(!args[1]) return message.reply('versuche es so: `!voice permit <@user>');
			const mention = args[1].toString().replace('<@!', '');
			const mentionId = mention.toString().replace('>', '');
			voiceChannel.updateOverwrite(mentionId, { VIEW_CHANNEL: true });
			channel.send(`Du hast <@${mentionId}> Zugriff auf diesen Kanal gegeben.`);
		}
		else if (args[0] === 'limit') {
			const amount = parseInt(args[1]) + 1;

			if (amount <= 1 || amount > 100) {
				return channel.send('Das Limit kann nur von 1-99 gesetzt werden.');
			}
			const channelLimit = args[1];
			voiceChannel.setUserLimit(channelLimit);
			channel.send(`Du hast das Limit deines Sprachkanals auf ${channelLimit} gesetzt.`);
			const uploadChannelLimit = await customs.findOneAndUpdate(
				{
					userId,
					channelId,
				},
				{
					userId,
					channelId,
					channelLimit,
				},
			);
		}
	},
};