const { MessageEmbed } = require('discord.js');
const { version } = require('../../package.json');

module.exports = {
	slash: 'both',
	callback: ({ client, message }) => {
		const hours = ((process.uptime() / 60) / 60).toFixed(0);
		const minutes = (process.uptime() / 60).toFixed(0);
		const embed = new MessageEmbed()
			.setAuthor(`Information über ${client.user.username}`, client.user.displayAvatarURL())
			.addFields (
				{ name: 'Allgemeine Info', value: 'Dieser Bot wurde von <@!255739211112513536> programmiert. Falls irgendetwas nicht funktioniert, schreibt ihm!' },
				{ name: 'Bekannte Bugs', value: '/' },
				{ name: 'Roadmap', value: '- Großes Hotel Update mit Reactions, Jukebox, etc.' },
				{ name: 'Version', value: version, inline: true },
				{ name: 'Aktuelle Laufzeit', value: `${hours} h (${minutes} min)`, inline: true },
				{ name: 'Server Count', value: `${client.guilds.cache.size} Server`, inline: true },
			)
			.setColor('f77600');
		if (message) {
			message.channel.send(embed);
		}
		return embed;
	},
};