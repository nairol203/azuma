module.exports = {
	callback: ({ client, message }) => {
		if (!message.member.voice.channel) return message.channel.send('<:no:767394810909949983> Du musst in einem Sprachkanal sein um diesen Command zu benutzen!');

		client.distube.pause(message);

		message.channel.send(':pause_button: Die Musik wurde pausiert.');
	},
};