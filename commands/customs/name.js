const customs = require('../../models/customs');

module.exports = {
	guildOnly: true,
	description: 'Ändert das Türschild von deinem Zimmer',
	options: [
		{
			name: 'name',
			description: 'Neuer Name',
			type: 3,
			required: true,
		}
	],
	callback: async ({ client, interaction }) => {
		const user = interaction.member.user;
		const userId = user.id
		const textChannelId = interaction.channelID;
		const result = await customs.findOne({ userId });
		const channelId = result.channelId;
		if (!result) return interaction.reply({ component: 'Du besitzt aktuell kein Zimmer!', ephemeral: true });
		if (result.textChannelId == textChannelId) {
			const voiceChannel = client.channels.cache.get(result.channelId)
			if(!voiceChannel) return interaction.reply({ component: 'Du besitzt aktuell kein Zimmer!', ephemeral: true });
			const name = interaction.options.get('name').value;
			voiceChannel.setName(name);
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
			interaction.reply(`Ich habe dein Türschild geändert: \`${name}\`.`);
		}
		else {
			interaction.reply('Du kannst diesen Befehl nur in <#' + result.textChannelId + '> verwenden!');
		};
	},
};