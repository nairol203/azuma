const customs = require('../../../models/customs');

module.exports = {
	callback: async ({ message }) => {
		const { author, channel } = message;
		const voiceChannel = message.member.voice.channel;
		const userId = author.id;
		const channelId = voiceChannel.id;

		const result = await customs.findOne({
			userId,
			channelId,
		});

		if(!result) {
			message.delete();
			return message.reply('du hast dieses Zimmer nicht gebucht und kannst deswegen den Zimmerservice nicht in Anspruch nehmen.').then(msg => {msg.delete({ timeout: 5000 }); });
		}

		message.delete();
		voiceChannel.updateOverwrite(author, { CONNECT: true });
		voiceChannel.updateOverwrite('255741114273759232', { CONNECT: false });
		channel.send('Alles klar, ich habe dein Zimmer für dich abgeschlossen.').then(msg => {msg.delete({ timeout: 5000 }); });

	},
};