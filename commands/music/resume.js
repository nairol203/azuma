const music = require('./play');

module.exports = {
	slash: true,
	callback: ({ interaction }) => {
		const serverQueue = music.serverQueue(interaction.guild_id);
		const guild = client.guilds.cache.get(interaction.guild_id)
		const member = guild.members.cache.get(interaction.member.user.id);
		const voiceChannel = member.voice.channel;

		if(!voiceChannel) return '<:no:767394810909949983> | Du musst in einem Sprachkanal sein um diesen Command zu benutzen!';
		if(!serverQueue) return '<:no:767394810909949983> | Es wird gerade nichts gespielt';
		if(serverQueue.playing) return 'Die Musik ist nicht pausiert.';
		serverQueue.playing = true;
		serverQueue.connection.dispatcher.resume();
		return 'Die Musik wird weiter abgespielt.';
	},
};