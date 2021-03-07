const customs = require('../../../models/customs');

module.exports = {
	callback: async ({ message }) => {
		const { author, channel } = message;
		const voiceChannel = message.member.voice.channel;
		const userId = author.id;
		const result = await customs.findOne({ userId });
		if (!result) return message.delete();
		if (result.textChannelId != channel.id) return message.delete();

		message.delete();
		voiceChannel.updateOverwrite(author, { CONNECT: true });
		voiceChannel.updateOverwrite('255741114273759232', { CONNECT: false });
		channel.send('Alles klar, ich habe dein Zimmer für dich abgeschlossen.').then(msg => {msg.delete({ timeout: 5000 }); });

	},
};