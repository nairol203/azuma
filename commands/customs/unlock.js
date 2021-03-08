const customs = require('../../models/customs');

module.exports = {
	slash: true,
	callback: async ({ client, interaction }) => {
		const user = interaction.member.user;
		const userId = user.id
		const textChannelId = interaction.channel_id;
		const result = await customs.findOne({ userId });
		if (!result) return 'Du besitzt aktuell kein Zimmer!';
		if (result.textChannelId == textChannelId) {
			const voiceChannel = client.channels.cache.get(result.channelId)
			if(!voiceChannel) return 'Du besitzt aktuell kein Zimmer!';
			voiceChannel.updateOverwrite('255741114273759232', { CONNECT: true});
			return 'Alles klar, ich habe dein Zimmer für dich aufgschlossen.';
		}
		else {
			return 'Du kannst diesen Befehl nur in (<#' + result.textChannelId + ' verwenden!';
		}

		// const { author, channel } = message;
		// const voiceChannel = message.member.voice.channel;
		// const userId = author.id;
		// const result = await customs.findOne({ userId });
		// if (!result) return message.delete();
		// if (result.textChannelId != channel.id) return message.delete();

		// message.delete();
		// voiceChannel.updateOverwrite('255741114273759232', { CONNECT: true });
		// channel.send('Alles klar, ich habe dein Zimmer für dich aufgeschlossen.').then(msg => {msg.delete({ timeout: 5000 }); });
	},
};