module.exports = {
	callback: ({ message }) => {
		const Discord = require('discord.js');
		const embed = new Discord.MessageEmbed()
			.setColor('#f77600')
			.setTitle(`${message.guild.name}`)
			.setThumbnail(`${message.guild.iconURL()}`)
			.addFields (
				{ name: 'Server ID:', value: `${message.guild.id}`, inline: true },
				{ name: 'Owner:', value: `${message.guild.owner}`, inline: true },
				{ name: 'Mitglieder:', value: `${message.guild.memberCount}` },
				{ name: 'Rollen:', value: `${message.guild.roles.cache.size}`, inline: true },
				{ name: 'Emojis:', value: `${message.guild.emojis.cache.size}`, inline: true },
				{ name: 'Region:', value: `${message.guild.region}` },
			)
			.setFooter(`${message.guild.createdAt}`);
		message.channel.send(embed);
	},
};