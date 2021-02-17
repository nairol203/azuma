module.exports = {
	aliases: 'p',
	minArgs: 1,
	expectedArgs: '<song title, link> | <playlist link>',
	callback: async ({ client, message, args }) => {
		if (!message.member.voice.channel) return message.channel.send('<:no:767394810909949983> Du musst in einem Sprachkanal sein um diesen Command zu benutzen!');

		await client.distube.play(message, args.join(' '));
		const mode = client.distube.toggleAutoplay(message);
	},
};