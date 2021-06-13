const customs = require('../../models/customs');

module.exports = {
	guildOnly: true,
	description: 'Ändert das Userlimit von deinem Zimmer',
	options: [
		{
			name: 'limit',
			description: 'Zahl von 1-99',
			type: 4,
			required: true,
		}
	],
	callback: async ({ client, interaction }) => {
		const user = interaction.member.user;
		const userId = user.id
		const textChannelId = interaction.channelID;
		const result = await customs.findOne({ userId });
		if (!result) return interaction.reply({ component: 'Du besitzt aktuell kein Zimmer!', ephemeral: true });
		if (result.textChannelId == textChannelId) {
			const voiceChannel = client.channels.cache.get(result.channelId)
			if(!voiceChannel) return interaction.reply({ component: 'Du besitzt aktuell kein Zimmer!', ephemeral: true });
			const channelLimit = interaction.options.get('limit').value;
			const amount = parseInt(channelLimit) + 1;
			if (amount > 100) return '';
			if (amount <= 0) return '';
			voiceChannel.setUserLimit(channelLimit);
			const channelId = voiceChannel.id;
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
			interaction.reply(`Alles klar, ich habe das Personenlimit auf \`${channelLimit}\` gesetzt.`);
		}
		else {
			interaction,reply('Du kannst diesen Befehl nur in (<#' + result.textChannelId + ' verwenden!');
		};
	},
};