const customs = require('../../models/customs');

module.exports = {
	guildOnly: true,
	description: 'Gibt einem bestimmten User den Zugriff auf dein Zimmer',
	options: [
		{
			name: 'user',
			description: 'User',
			type: 6,
			required: true,
		}
	],
	callback: async ({ client, interaction }) => {
		const user = interaction.member.user;
		const userId = user.id;
		const textChannelId = interaction.channelID;
		const result = await customs.findOne({ userId });
		if (!result) return interaction.reply({ component: 'Du besitzt aktuell kein Zimmer!', ephemeral: true });
		if (result.textChannelId == textChannelId) {
			const voiceChannel = client.channels.cache.get(result.channelId);
			if(!voiceChannel) return interaction.reply({ component: 'Du besitzt aktuell kein Zimmer!', ephemeral: true });
			const mention = interaction.options.get('user').value;
			voiceChannel.updateOverwrite(mention, { CONNECT: true });
			interaction.reply(`Ich habe <@${mention}> den Schlüssel zu deinem Zimmer gegeben.`);
		}
		else {
			interaction.reply('Du kannst diesen Befehl nur in (<#' + result.textChannelId + ' verwenden!');
		}
	},
};