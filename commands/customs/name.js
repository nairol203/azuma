const customs = require('../../models/customs');

module.exports = {
	slash: true,
	description: 'Ändert das Türschild von deinem Zimmer',
	options: [
		{
			name: 'name',
			description: 'Neuer Name',
			type: 3,
			required: true,
		}
	],
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
			const channelName = name;
			await customs.findOneAndUpdate(
				{
					userId,
					channelId,
				},
				{
					userId,
					channelName,
				},
			);
			return `Ich habe dein Türschild geändert: \`${name}\`.`;
		}
		else {
			return 'Du kannst diesen Befehl nur in <#' + result.textChannelId + '> verwenden!';
		}
	},
};