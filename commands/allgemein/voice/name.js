const customs = require('../../../models/customs');

module.exports = {
	minArgs: 1,
	maxArgs: 1,
	expectedArgs: '<name>',
	callback: async ({ message, args }) => {
		const { author, channel } = message;
		const voiceChannel = message.member.voice.channel;
		const userId = author.id;
		const channelId = voiceChannel.id;
		const result = await customs.findOne({ userId });
		if (!result) return message.delete();
		if (result.textChannelId != channel.id) return message.delete();

		message.delete();
		const name = args.join(' ');
		voiceChannel.setName(name);
		channel.send(`Ich habe dein Türschild geändert: \`${name}\`.`).then(msg => {msg.delete({ timeout: 5000 }); });
		const channelName = name;
		await customs.findOneAndUpdate(
			{
				userId,
				channelId,
			},
			{
				userId,
				channelId,
				channelName,
			},
		);

	},
};