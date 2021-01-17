module.exports = {
	aliases: 'vol',
	minArgs: 1,
	maxArgs: 1,
	expectedArgs: '<number>',
	callback: ({ client, message, args }) => {
		if (!message.member.voice.channel) return message.channel.send('<:no:767394810909949983> Du musst in einem Sprachkanal sein um diesen Command zu benutzen!');

		client.distube.setVolume(message, args[0]);
	},
};