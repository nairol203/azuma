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

		// const { author, channel } = message;
		// const voiceChannel = message.member.voice.channel;
		// const userId = author.id;
		// const channelId = voiceChannel.id;
		// const result = await customs.findOne({ userId });
		// if (!result) return message.delete();
		// if (result.textChannelId != channel.id) return message.delete();

		// message.delete();
		// const amount = parseInt(args[0]) + 1;
		// if (amount > 100) return channel.send('Dein Raum hat nur eine Größe für 99 Personen!').then(msg => {msg.delete({ timeout: 5000 }); });
		// if (amount <= 0) return;
		// const channelLimit = args[0];
		// voiceChannel.setUserLimit(channelLimit);
		// channel.send(`Alles klar, ich habe das Personenlimit auf \`${channelLimit}\` gesetzt.`).then(msg => {msg.delete({ timeout: 5000 }); });
		// await customs.findOneAndUpdate(
		// 	{
		// 		userId,
		// 		channelId,
		// 	},
		// 	{
		// 		userId,
		// 		channelId,
		// 		channelLimit,
		// 	},
		// );
	},
};