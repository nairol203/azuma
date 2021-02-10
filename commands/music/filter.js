module.exports = {
	minArgs: 1,
	maxArgs: 1,
	expectedArgs: '<3d | bassboost | echo | karaoke | nightcore | vaporwave | flanger | gate | haas | reverse | surround | mcompand | phaser | tremolo | earwax>',
	callback: ({ client, message, args }) => {
		if (!message.member.voice.channel) return message.channel.send('<:no:767394810909949983> Du musst in einem Sprachkanal sein um diesen Command zu benutzen!');
		const queue = client.distube.getQueue(message);
		if (!queue) return message.channel.send('<:no:767394810909949983> | Du diesen Befehl nur benutzen wenn Musik gespielt wird.');

		if (args[0] === 'off' && queue.filter) client.distube.setFilter(message, queue.filter);
		else if (Object.keys(client.distube.filters).includes(args[0])) client.distube.setFilter(message, args[0]);
		else if (args[0]) return message.channel.send('<:no:767394810909949983> Das ist kein gültiger Filter.');
		message.channel.send(`Current Queue Filter: \`${queue.filter || 'Off'}\``);
	},
};