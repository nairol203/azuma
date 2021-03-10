const { MessageEmbed } = require('discord.js');
const music = require('./play');

module.exports = {
	slash: true,
	callback: ({ interaction }) => {
		const serverQueue = music.serverQueue(interaction.guild_id);

		if(!serverQueue) return '<:no:767394810909949983> | Es wird gerade nichts gespielt.';
		const embed = new MessageEmbed()
			.setTitle('Song Queue:')
			.setDescription(serverQueue.songs.map(song => `**-** \`${song.title}\` - \`${song.duration}\``).join('\n'))
			.setColor('#fabe00');
		return embed;
	},
};