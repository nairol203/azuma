const { MessageEmbed } = require('discord.js');
const { no } = require('../../emoji.json');
const { serverQueue } = require('../../features/music');

module.exports = {
	description: 'zeigt die aktuelle Song Queue an',
	callback: ({ interaction }) => {
		const sQ = serverQueue(interaction.guild_id);
		if(!sQ) return  no + ' | Es wird gerade nichts gespielt.';
		const embed = new MessageEmbed()
			.setTitle('Queue')
			.addFields(
				{ name: 'Playing:', value: `[${sQ.songs[0].title}](${sQ.songs[0].url}) - \`${sQ.songs[0].duration}\`` },
				{ name: 'Next songs:', value: sQ.songs.slice(1, 11).map(song => `**-** [${song.title}](${song.url}) - \`${song.duration}\``).join('\n') },
				{ name: 'Länge der Queue:', value: sQ.songs.length + ` song(s)`},
			)
			.setColor('#f77600');
		return embed;
	},
};