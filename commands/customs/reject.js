const customs = require('../../models/customs');

module.exports = {
	guildOnly: true,
	description: 'Verweigert einem bestimmten User den Zugriff auf dein Zimmer',
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
		const userId = user.id
		const textChannelId = interaction.channelID;
		const result = await customs.findOne({ userId });
		if (!result) return interaction.reply({ component: 'Du besitzt aktuell kein Zimmer!', ephemeral: true });
		if (result.textChannelId == textChannelId) {
			const voiceChannel = client.channels.cache.get(result.channelId)
			if(!voiceChannel) return interaction.reply({ component: 'Du besitzt aktuell kein Zimmer!', ephemeral: true });
			const mention = interaction.options.get('user').value;
			voiceChannel.updateOverwrite(mention, { CONNECT: false });
			interaction.reply(`<@${mention}> hat den Schlüssel zu deinem Zimmer zurückgegeben.`);
		}
		else {
			interaction.reply('Du kannst diesen Befehl nur in (<#' + result.textChannelId + ' verwenden!');
		}
	},
};