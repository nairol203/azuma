const { MessageEmbed } = require('discord.js');
const { version } = require('../../package.json');

module.exports = {
	slash: true,
	description: 'Informationen über Azuma',
	callback: ({ client }) => {
		const hours = ((process.uptime() / 60) / 60).toFixed(0);
		const minutes = (process.uptime() / 60).toFixed(0);
		const embed = new MessageEmbed()
			.setAuthor(`Information über ${client.user.username}`, client.user.displayAvatarURL())
			.addFields (
				{ name: 'Allgemeine Info', value: 'Dieser Bot wurde von <@!255739211112513536> programmiert. Falls irgendetwas nicht funktioniert, schreibt ihm!' },
				{ name: 'Bekannte Bugs', value: '- `/play <playlist link>` gibt einen Error, funktioniert aber\n\nDu glaubst du hast einen Bug gefunden? Benutze `/report <bug>`' },
				{ name: 'Roadmap', value: '- Großes Hotel Update mit Reactions, Jukebox, etc.' },
				{ name: 'Version', value: version, inline: true },
				{ name: 'Aktuelle Laufzeit', value: `${hours} h (${minutes} min)`, inline: true },
				{ name: 'Server Count', value: `${client.guilds.cache.size} Server`, inline: true },
			)
			.setColor('f77600');
		return embed;
	},
};