module.exports = {
	callback: ({ client, message }) => {
		if (!message.member.voice.channel) return message.channel.send('<:no:767394810909949983> Du musst in einem Sprachkanal sein um diesen Command zu benutzen!');
		const queue = client.distube.getQueue(message);
		if (!queue) return message.channel.send('<:no:767394810909949983> | Du diesen Befehl nur benutzen wenn Musik gespielt wird.');

		client.distube.skip(message);

		message.channel.send(':fast_forward: Das Lied wurde übersprungen.');
	},
};