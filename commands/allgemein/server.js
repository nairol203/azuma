const { MessageEmbed } = require('discord.js');

module.exports = {
	slash: true,
	callback: ({ client, interaction }) => {
		const guild = client.guilds.cache.get(interaction.guild_id);
		const embed = new MessageEmbed()
			.setColor('#f77600')
			.setTitle(`${guild.name}`)
			.setThumbnail(`${guild.iconURL()}`)
			.addFields (
				{ name: 'Server ID:', value: `${guild.id}`, inline: true },
				{ name: 'Owner:', value: `${guild.owner}`, inline: true },
				{ name: 'Mitglieder:', value: `${guild.memberCount}` },
				{ name: 'Rollen:', value: `${guild.roles.cache.size}`, inline: true },
				{ name: 'Emojis:', value: `${guild.emojis.cache.size}`, inline: true },
				{ name: 'Region:', value: `${guild.region}` },
			)
			.setFooter(`${guild.createdAt}`);
		return embed;
	},
};