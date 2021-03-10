const music = require('./play');

module.exports = {
	slash: true,
	callback: ({ interaction }) => {
		const serverQueue = music.serverQueue(interaction.guild_id);
		const voiceChannel = undefined;

		if(!voiceChannel) return '<:no:767394810909949983> | Du musst in einem Sprachkanal sein um diesen Command zu benutzen!';
		if(!serverQueue) return '<:no:767394810909949983> | Es wird gerade nichts gespielt.';
		serverQueue.connection.dispatcher.end();
		return 'Das Lied wurde übersprungen.';
	},
};