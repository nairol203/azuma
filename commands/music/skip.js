const { no } = require('../../emoji.json');
const music = require('./play');

module.exports = {
	slash: true,
	description: 'Überspringt den aktuellen Song!',
	callback: ({ client, interaction }) => {
		const serverQueue = music.serverQueue(interaction.guild_id);
		const guild = client.guilds.cache.get(interaction.guild_id)
		const member = guild.members.cache.get(interaction.member.user.id);
		const voiceChannel = member.voice.channel;

		if(!voiceChannel) return no + ' | Du musst in einem Sprachkanal sein um diesen Command zu benutzen!';
		if(!serverQueue) return no + ' | Es wird gerade nichts gespielt.';
		serverQueue.connection.dispatcher.end();
		return 'Das Lied wurde übersprungen.';
	},
};