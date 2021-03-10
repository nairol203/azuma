const music = require('./play');

module.exports = {
	slash: true,
	callback: ({ interaction }) => {
		const serverQueue = music.serverQueue(interaction.guild_id);
		if(!serverQueue) return '<:no:767394810909949983> | Es wird gerade nichts gespielt';
		return `:notes: | Now Playing: \`${serverQueue.songs[0].title}\` - \`${serverQueue.songs[0].duration}\``;
	},
};