module.exports = {
	callback: ({ client, message, args }) => {
		const queue = client.distube.getQueue(message);
		if (!queue) return message.channel.send('<:no:767394810909949983> Es wird nichts gespielt.');
		if (args[0] === 'off' && queue.filter) client.distube.setFilter(message, queue.filter);
		else if (Object.keys(client.distube.filters).includes(args[0])) client.distube.setFilter(message, args[0]);
		else if (args[0]) return message.channel.send('<:no:767394810909949983> Das ist kein gültiger Filter.');
		message.channel.send(`Current Queue Filter: \`${queue.filter || 'Off'}\``);
	},
};