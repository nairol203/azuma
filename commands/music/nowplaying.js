const { MessageEmbed } = require('discord.js');
const { no } = require('../../emoji.json');
const music = require('./play');

module.exports = {
	slash: true,
	description: 'Zeigt an was aktuell gespielt wird',
	callback: ({ interaction }) => {
		const userId = interaction.member.user.id;
		const serverQueue = music.serverQueue(interaction.guild_id);
		if(!serverQueue) return  no + ' | Es wird gerade nichts gespielt';
		const embed = new MessageEmbed()
		.setTitle('Now Playing:')
		.setDescription(`[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})`)
		.addFields(
			{ name: 'Requested by', value: `<@${userId}>`, inline: true },
			{ name: 'Länge', value: `\`${serverQueue.songs[0].duration}\``, inline: true },
			{ name: 'Queue', value: `${serverQueue.songs.length} - \`${serverQueue.songs[0].duration}\``, inline: true },
		)
		.setColor('#f77600');
		return embed;
	},
};