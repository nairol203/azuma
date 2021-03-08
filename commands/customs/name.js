const customs = require('../../models/customs');

module.exports = {
	slash: true,
	minArgs: 1,
	expectedArgs: '<name>',
	callback: async ({ client, args, interaction }) => {
		const user = interaction.member.user;
		const userId = user.id
		const textChannelId = interaction.channel_id;
		const result = await customs.findOne({ userId });
		if (!result) return 'Du besitzt aktuell kein Zimmer!';
		if (result.textChannelId == textChannelId) {
			const voiceChannel = client.channels.cache.get(result.channelId)
			if(!voiceChannel) return 'Du besitzt aktuell kein Zimmer!';
			const name = args.name;
			voiceChannel.setName(name);
			return `Ich habe dein Türschild geändert: \`${name}\`.`;
		}
		else {
			return 'Du kannst diesen Befehl nur in <#' + result.textChannelId + '> verwenden!';
		}

		// const { author, channel } = message;
		// const voiceChannel = message.member.voice.channel;
		// const userId = author.id;
		// const channelId = voiceChannel.id;
		// const result = await customs.findOne({ userId });
		// if (!result) return message.delete();
		// if (result.textChannelId != channel.id) return message.delete();

		// message.delete();
		// const name = args.join(' ');
		// voiceChannel.setName(name);
		// channel.send(`Ich habe dein Türschild geändert: \`${name}\`.`).then(msg => {msg.delete({ timeout: 5000 }); });
		// const channelName = name;
		// await customs.findOneAndUpdate(
		// 	{
		// 		userId,
		// 		channelId,
		// 	},
		// 	{
		// 		userId,
		// 		channelId,
		// 		channelName,
		// 	},
		// );
	},
};