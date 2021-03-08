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
			voiceChannel.updateOverwrite(mention, { CONNECT: false });
			return `<@${mention}> hat den Schlüssel zu deinem Zimmer zurückgegeben.`;
		}
		else {
			return 'Du kannst diesen Befehl nur in (<#' + result.textChannelId + ' verwenden!';
		}

		// const { author, channel } = message;
		// const voiceChannel = message.member.voice.channel;
		// const userId = author.id;
		// const result = await customs.findOne({ userId });
		// if (!result) return message.delete();
		// if (result.textChannelId != channel.id) return message.delete();

		// message.delete();
		// const name = args.join(' ');
		// try {
		// 	const mention = client.users.cache.find(u => u.username == `${name}`);
		// 	if (!mention) voiceChannel.updateOverwrite(mention.id, { CONNECT: false });
		// 	channel.send(`${mention} hat den Schlüssel zu deinem Zimmer zurückgegeben.`).then(msg => {msg.delete({ timeout: 5000 }); });
		// }
		// catch {
		// 	channel.send('Ich konnte niemand finden, der so heißt. Tipp: Ich kann aktuell noch keine Nicknamen verstehen!').then(message.delete({ timeout: 5000 }));
		// 	return;
		// }
	},
};