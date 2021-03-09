const customs = require('../../models/customs');

module.exports = {
	slash: true,
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
			voiceChannel.updateOverwrite(mention, { CONNECT: true });
			return `Ich habe <@${mention}> den Schlüssel zu deinem Zimmer gegeben.`
		}
		else {
			return 'Du kannst diesen Befehl nur in (<#' + result.textChannelId + ' verwenden!';
		}
	},
};