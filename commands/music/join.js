module.exports = {
	callback: async ({ message }) => {
		const voiceChannel = message.member.voice.channel;
		if(!voiceChannel) return message.channel.send('<:no:767394810909949983> | Du musst in einem Sprachkanal sein um diesen Command zu benutzen!');
		await voiceChannel.join();
	},
};