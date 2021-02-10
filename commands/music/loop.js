module.exports = {
	aliases: 'repeat',
	callback: ({ client, message, args }) => {
		if (!message.member.voice.channel) return message.channel.send('<:no:767394810909949983> Du musst in einem Sprachkanal sein um diesen Command zu benutzen!');

		let mode = client.distube.setRepeatMode(message, parseInt(args[0]));
		mode = mode ? mode == 2 ? 'Repeat queue' : 'Repeat song' : 'Off';
		message.channel.send('Der Repeat Modus wurde auf `' + mode + '` gesetzt.');
	},
};