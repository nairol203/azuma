const customs = require('../../../models/customs');

module.exports = {
	callback: async ({ client, message, args }) => {
		const { author, channel } = message;
		const voiceChannel = message.member.voice.channel;
		const userId = author.id;
		const channelId = voiceChannel.id;

		const result = await customs.findOne({
			userId,
			channelId,
		});

		if(!result) {
			message.delete();
			return message.reply('du hast dieses Zimmer nicht gebucht und kannst deswegen den Zimmerservice nicht in Anspruch nehmen.').then(msg => {msg.delete({ timeout: 5000 }); });
		}

		message.delete();
		if(!args[0]) return message.reply('versuche es so: `!voice reject <username>`').then(msg => {msg.delete({ timeout: 5000 }); });
		const name = args.join(' ');
		const mention = client.users.cache.find(u => u.username == `${name}`);
		if (mention === undefined) return channel.send('Ich konnte niemand finden, der so heißt. Tipp: Ich kann aktuell noch keine Nicknamen verstehen!').then(message.delete({ timeout: 5000 }));
		voiceChannel.updateOverwrite(mention.id, { CONNECT: false });
		channel.send(`${mention} hat den Schlüssel zu deinem Zimmer zurückgegeben.`).then(msg => {msg.delete({ timeout: 5000 }); });

	},
};