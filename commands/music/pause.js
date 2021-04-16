const { no } = require('../../emoji.json');
const { serverQueue } = require('../../features/music');

module.exports = {
	description: 'Pausiert die Musik',
	callback: ({ client, interaction }) => {
		const sQ = serverQueue(interaction.guild_id);
		const guild = client.guilds.cache.get(interaction.guild_id)
		const member = guild.members.cache.get(interaction.member.user.id);
		const voiceChannel = member.voice.channel;

		if(!voiceChannel) return  no + ' | Du musst in einem Sprachkanal sein um diesen Command zu benutzen!';
		if(!sQ) return  no + ' | Es wird gerade nichts gespielt';
		if(!sQ.playing) return 'Die Musik ist schon pausiert.';
		sQ.playing = false;
		sQ.connection.dispatcher.pause();
		return 'Die Musik wurde pausiert.';
	},
};