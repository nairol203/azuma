const { MessageEmbed } = require('discord.js');
const { no } = require('../../emoji.json');
const { serverQueue } = require('../../features/music');

module.exports = {
	description: 'Zeigt an was aktuell gespielt wird',
	callback: ({ interaction }) => {
		const userId = interaction.member.user.id;
		const sQ = serverQueue(interaction.guild_id);
		if(!sQ) return  no + ' | Es wird gerade nichts gespielt';
		const embed = new MessageEmbed()
		.setTitle('Now Playing:')
		.setDescription(`[${sQ.songs[0].title}](${sQ.songs[0].url})`)
		.addFields(
			{ name: 'Requested by', value: `<@${userId}>`, inline: true },
			{ name: 'Länge', value: `\`${sQ.songs[0].duration}\``, inline: true },
			{ name: 'Queue', value: `${sQ.songs.length} - \`${sQ.songs[0].duration}\``, inline: true },
		)
		.setColor('#f77600');
		return embed;
	},
};