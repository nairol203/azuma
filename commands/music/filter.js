module.exports = {
	minArgs: 1,
	maxArgs: 1,
	expectedArgs: '`<filter>',
	callback: ({ client, message, args }) => {
		if (!message.member.voice.channel) return message.channel.send('<:no:767394810909949983> Du musst in einem Sprachkanal sein um diesen Command zu benutzen!');
		const queue = client.distube.getQueue(message);
		if (!queue) return message.channel.send('<:no:767394810909949983> | Du diesen Befehl nur benutzen wenn Musik gespielt wird.');

		if(args[0] === 'help') return message.channel.send('Alle Filter:\n- 3d\n- bassboost\n- echo\n- karaoke\n- nightcore\n- vaporwave\n- flanger\n- gate\n- haas\n- reverse\n- surround\n- mcompand\n- phaser\n- tremolo\n- earwax');

		if (args[0] === 'off' && queue.filter) client.distube.setFilter(message, queue.filter);
		else if (Object.keys(client.distube.filters).includes(args[0])) client.distube.setFilter(message, args[0]);
		else if (args[0]) return message.channel.send('<:no:767394810909949983> Das ist kein gültiger Filter.');
		message.channel.send(`Current Queue Filter: \`${queue.filter || 'Off'}\``);
	},
};