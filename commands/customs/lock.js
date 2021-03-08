const customs = require('../../models/customs');

module.exports = {
	slash: 'both',
	callback: async ({ client, message, interaction }) => {
		if (message) {
			message.channel.send('Der Befehl wurde zu einem Slash-Command geupdatet! Benutze von jetzt an `/lock`!');
			return;
		}
		const user = interaction.member.user;
		const userId = user.id
		const textChannelId = interaction.channel_id;
		const result = await customs.findOne({ userId });
		if (!result) return 'Du besitzt aktuell kein Zimmer!';
		if (result.textChannelId == textChannelId) {
			const voiceChannel = client.channels.cache.get(result.channelId)
			if(!voiceChannel) return 'Du besitzt aktuell kein Zimmer!';
			voiceChannel.updateOverwrite(userId, { CONNECT: true });
			voiceChannel.updateOverwrite('255741114273759232', { CONNECT: false});
			return 'Alles klar, ich habe dein Zimmer für dich abgeschlossen.';
		}
		else {
			return 'Du kannst diesen Befehl nur <#' + result.textChannelId + '> verwenden!';
		}
		

		// const { author, channel } = message;
		// const voiceChannel = message.member.voice.channel;
		// const userId = author.id;
		// const result = await customs.findOne({ userId });
		// if (!result) return message.delete();
		// if (result.textChannelId != channel.id) return message.delete();

		// message.delete();
		// voiceChannel.updateOverwrite(author, { CONNECT: true });
		// voiceChannel.updateOverwrite('255741114273759232', { CONNECT: false });
		// channel.send('Alles klar, ich habe dein Zimmer für dich abgeschlossen.').then(msg => {msg.delete({ timeout: 5000 }); });
	},
};