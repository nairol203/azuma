module.exports = {
	callback: async ({ client, message }) => {
		if (!message.member.voice.channel) return message.channel.send('<:no:767394810909949983> Du musst in einem Sprachkanal sein um diesen Command zu benutzen!');

		const queue = await client.distube.getQueue(message);

		if(queue) {
			client.distube.stop(message);
			message.channel.send(':stop_button: Die Musik wurde gestoppt.');
		}
		else if (!queue) {
			message.channel.send('<:no:767394810909949983> Es wird nichts gespielt.');
		}
	},
};