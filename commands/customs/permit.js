const customs = require('../../models/customs');

module.exports = {
	minArgs: 1,
	expectedArgs: '<username>',
	callback: async ({ client, message, args }) => {
		const { author, channel } = message;
		const voiceChannel = message.member.voice.channel;
		const userId = author.id;
		const result = await customs.findOne({ userId });
		if (!result) return message.delete();
		if (result.textChannelId != channel.id) return message.delete();

		message.delete();
		const name = args.join(' ');
		try {
			const mention = client.users.cache.find(u => u.username == `${name}`);
			voiceChannel.updateOverwrite(mention.id, { CONNECT: true });
			channel.send(`Ich habe ${mention} den Schlüssel zu deinem Zimmer gegeben.`).then(msg => {msg.delete({ timeout: 5000 }); });
		}
		catch {
			channel.send('Ich konnte niemand finden, der so heißt. Tipp: Ich kann aktuell noch keine Nicknamen verstehen!').then(msg => {msg.delete({ timeout: 5000 }); });
			return;
		}
	},
};