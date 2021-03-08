const customs = require('../../models/customs');

module.exports = {
	minArgs: 1,
	expectedArgs: '<username>',
	slash: 'both',
	callback: async ({ client, message, args, interaction }) => {
		if (message) {
			message.channel.send('Der Befehl wurde zu einem Slash-Command geupdatet! Benutze von jetzt an `/permit`!');
			return;
		}
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
		// 	voiceChannel.updateOverwrite(mention.id, { CONNECT: true });
		// 	channel.send(`Ich habe ${mention} den Schlüssel zu deinem Zimmer gegeben.`).then(msg => {msg.delete({ timeout: 5000 }); });
		// }
		// catch {
		// 	channel.send('Ich konnte niemand finden, der so heißt. Tipp: Ich kann aktuell noch keine Nicknamen verstehen!').then(msg => {msg.delete({ timeout: 5000 }); });
		// 	return;
		// }
	},
};