const { MessageEmbed } = require('discord.js');
const { no } = require('../../emoji.json');
const { serverQueue } = require('../../features/music');

module.exports = {
	slash: true,
	description: 'zeigt die aktuelle Song Queue an',
	callback: ({ interaction }) => {
		const sQ = serverQueue(interaction.guild_id);

		const embed = new MessageEmbed()
		.setTitle('Queue')
		.addFields(
			{ name: 'Playing:', value: `[${sQ.songs[0].title}](${sQ.songs[0].url}) - \`${sQ.songs[0].duration}\`` },
		)
		.setColor('#f77600');

		if(!sQ) return  no + ' | Es wird gerade nichts gespielt.';
		if (sQ.songs.length > 10) {
			embed.addField('Next song:', `**-** [${sQ.songs[1].title}](${sQ.songs[1].url}) - \`${sQ.songs[1].duration}\``)
			embed.addField('Länge der Queue:', sQ.songs.length + ` song(s)`)
			return embed
		}
		embed.addField('Next songs:', sQ.songs.map(song => `**-** [${song.title}](${song.url}) - \`${song.duration}\``).join('\n'))
		embed.addField('Länge der Queue:', sQ.songs.length + ` song(s)`)
		return embed;
	},
};