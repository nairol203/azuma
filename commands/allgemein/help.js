const Discord = require('discord.js');

module.exports = {
	expectedArgs: '<command>',
	minArgs: 0,
	maxArgs: 1,
	callback: ({ message, instance }) => {
		const prefix = instance.getPrefix(message.guild);

		const embed = new Discord.MessageEmbed()
			.setColor('#f77600')
			.setTitle(`Befehle von ${message.guild.name}`)
			.setDescription(`Tipp: Benutze \`${prefix}help <command>\` um mehr über einen bestimmten Befehl zu erfahren.`)
			.setThumbnail(`${message.guild.iconURL()}`)
			.addFields (
				{ name: 'Misc', value: '`howto` `info` `ping` `server` `text`', inline: true },
				{ name: 'Economy', value: '`credits` `daily` `pay` `business` `work`', inline: true },
				{ name: 'Games', value: '`coinflip` `fish` `rps`', inline: true },
				{ name: 'Level', value: '`rank` `leaderboard`', inline: true },
				{ name: 'Musik', value: '`loop` `nowplaying` `pause` `play` `queue` `resume` `search` `skip` `stop` `volume`', inline: true },
				{ name: 'Admin', value: '`ban` `deploy` `ismuted` `kick` `mute` `prune` `unban` `unmute`', inline: true },
			);
		return message.channel.send(embed);
	},
};