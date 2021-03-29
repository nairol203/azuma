const customs = require('../../models/customs');

module.exports = {
	description: 'Ändert das Userlimit von deinem Zimmer',
	options: [
		{
			name: 'limit',
			description: 'Zahl von 1-99',
			type: 4,
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
			const channelLimit = args.limit;
			const amount = parseInt(channelLimit) + 1;
			if (amount > 100) return '';
			if (amount <= 0) return '';
			voiceChannel.setUserLimit(channelLimit);
			const channelId = voiceChannel.id;
			await customs.findOneAndUpdate(
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
			return `Alles klar, ich habe das Personenlimit auf \`${channelLimit}\` gesetzt.`
		}
		else {
			return 'Du kannst diesen Befehl nur in (<#' + result.textChannelId + ' verwenden!';
		}
	},
};