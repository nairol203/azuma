const { version } = require('../../package.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
	callback: ({ client, message, instance }) => {
		const prefix = instance.getPrefix(message.guild);
		const hours = ((process.uptime() / 60) / 60).toFixed(0);
		const minutes = (process.uptime() / 60).toFixed(0);
		const embed = new MessageEmbed()
			.setAuthor(`Information über ${client.user.username}`, client.user.displayAvatarURL())
			.addFields (
				{ name: 'Allgemeine Info', value: 'Dieser Bot wurde von <@!255739211112513536> programmiert. Falls irgendetwas nicht funktioniert, schreibt ihm!' },
				{ name: 'Bekannte Bugs', value: `- Das Level-Modul bringt den Bot zum crashen und wurde deaktiviert\n- \`${prefix}fish\` zieht keine Coins bei einem Angelversuch ab\n- \`${prefix}help <arg>\` funktioniert nicht\n- \`${prefix}reload <arg>\` funktioniert nicht` },
				{ name: 'Roadmap', value: '- Mute command\n- Warn Command\n- Spotify Integration\n- Und mehr!' },
				{ name: 'Version', value: version, inline: true },
				{ name: 'Aktuelle Laufzeit', value: `${hours} h (${minutes} min)`, inline: true },
				{ name: 'Server Count', value: `${client.guilds.cache.size} Server`, inline: true },
			)
			.setColor('f77600');
		return message.channel.send(embed);
	},
};