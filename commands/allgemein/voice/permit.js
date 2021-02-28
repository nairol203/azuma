const customs = require('../../../models/customs');

module.exports = {
	callback: async ({ client, message, args }) => {
		const { author, channel } = message;
		const voiceChannel = message.member.voice.channel;
		const userId = author.id;
		const result = await customs.findOne({ userId });
		if (!result) return message.delete();
		if (result.textChannelId != channel.id) return message.delete();

		message.delete();
		if(!args[0]) return message.reply('versuche es so: `!voice permit <username>').then(msg => {msg.delete({ timeout: 5000 }); });
		const name = args.join(' ');
		const mention = client.users.cache.find(u => u.username == `${name}`);
		if (mention === undefined) return channel.send('Ich konnte niemand finden, der so heißt. Tipp: Ich kann aktuell noch keine Nicknamen verstehen!').then(msg => {msg.delete({ timeout: 5000 }); });
		voiceChannel.updateOverwrite(mention.id, { CONNECT: true });
		channel.send(`Ich habe ${mention} den Schlüssel zu deinem Zimmer gegeben.`).then(msg => {msg.delete({ timeout: 5000 }); });
	},
};