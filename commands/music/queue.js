const { MessageEmbed } = require('discord.js');
const music = require('./play');

module.exports = {
	slash: true,
	callback: ({ interaction }) => {
		const serverQueue = music.serverQueue(interaction.guild_id);

		const embed = new MessageEmbed()
		.setTitle('Queue')
		.addFields(
			{ name: 'Playing:', value: `[${serverQueue.songs[0].title}](${serverQueue.songs[0].url}) - \`${serverQueue.songs[0].duration}\`` },
		)
		.setColor('#f77600');

		if(!serverQueue) return '<:no:767394810909949983> | Es wird gerade nichts gespielt.';
		if (serverQueue.songs.length > 10) {
			embed.addField('Next song:', `**-** [${serverQueue.songs[1].title}](${serverQueue.songs[1].url}) - \`${serverQueue.songs[1].duration}\``)
			embed.addField('Länge der Queue:', serverQueue.songs.length + ` song(s)`)
			return embed
		}
		embed.addField('Next songs:', serverQueue.songs.map(song => `**-** [${song.title}](${song.url}) - \`${song.duration}\``).join('\n'))
		embed.addField('Länge der Queue:', serverQueue.songs.length + ` song(s)`)
		return embed;
	},
};