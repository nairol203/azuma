const customs = require('../../../models/customs');

module.exports = {
	callback: async ({ message, args }) => {
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
		const amount = parseInt(args[0]) + 1;
		if (amount > 100) return channel.send('Dein Raum hat nur eine Größe für 99 Personen!').then(msg => {msg.delete({ timeout: 5000 }); });
		if (amount <= 0) return;
		const channelLimit = args[0];
		voiceChannel.setUserLimit(channelLimit);
		channel.send(`Alles klar, ich habe das Personenlimit auf \`${channelLimit}\` gesetzt.`).then(msg => {msg.delete({ timeout: 5000 }); });
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
	},
};