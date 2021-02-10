module.exports = {
	aliases: 'vol',
	minArgs: 1,
	maxArgs: 1,
	expectedArgs: '<number>',
	callback: ({ client, message, args }) => {
		if (!message.member.voice.channel) return message.channel.send('<:no:767394810909949983> Du musst in einem Sprachkanal sein um diesen Command zu benutzen!');
		const queue = client.distube.getQueue(message);
		if (!queue) return message.channel.send('<:no:767394810909949983> | Du diesen Befehl nur benutzen wenn Musik gespielt wird.');

		const amount = parseInt(args[0]) + 1;

		if (amount <= 0 || amount > 100) {
			return message.channel.send('Bitte benutze eine Zahl von 1-100!');
		}

		client.distube.setVolume(message, args[0]);
		message.channel.send(`Die Lautstärke wurde auf ${args[0]}% gesetzt.`);
	},
};