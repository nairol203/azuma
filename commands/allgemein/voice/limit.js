const customs = require('../../../models/customs');

module.exports = {
	minArgs: 1,
	maxArgs: 1,
	expectedArgs: '<1-99>',
	callback: async ({ message, args }) => {
		const { author, channel } = message;
		const voiceChannel = message.member.voice.channel;
		const userId = author.id;
		const channelId = voiceChannel.id;
		const result = await customs.findOne({ userId });
		if (!result) return message.delete();
		if (result.textChannelId != channel.id) return message.delete();

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