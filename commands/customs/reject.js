const customs = require('../../models/customs');

module.exports = {
	description: 'Verweigert einem bestimmten User den Zugriff auf dein Zimmer',
	options: [
		{
			name: 'user',
			description: 'User',
			type: 6,
			required: true,
		}
	],
	callback: async ({ client, args, interaction }) => {
		const user = interaction.member.user;
		const userId = user.id
		const textChannelId = interaction.channel_id;
		const result = await customs.findOne({ userId });
		if (!result) return 'Du besitzt aktuell kein Zimmer!';
		if (result.textChannelId == textChannelId) {
			const voiceChannel = client.channels.cache.get(result.channelId)
			if(!voiceChannel) return 'Du besitzt aktuell kein Zimmer!';
			const mention = args.user
			voiceChannel.updateOverwrite(mention, { CONNECT: false });
			return `<@${mention}> hat den Schlüssel zu deinem Zimmer zurückgegeben.`;
		}
		else {
			return 'Du kannst diesen Befehl nur in (<#' + result.textChannelId + ' verwenden!';
		}
	},
};