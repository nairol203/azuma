const Discord = require('discord.js');

module.exports = {
	category: 'Help',
	description: 'Alle Commands von diesem Bot.',
	expectedArgs: '<command>',
	minArgs: 0,
	maxArgs: 1,
	callback: ({ message, args, instance }) => {
		const prefix = instance.getPrefix(message.guild);

		if (!args.length) {
			const embed = new Discord.MessageEmbed()
				.setColor('#f77600')
				.setTitle(`Befehle von ${message.guild.name}`)
				.setDescription(`Tipp: Benutze \`${prefix}help <command>\` um mehr über einen bestimmten Befehl zu erfahren.`)
				.setThumbnail(`${message.guild.iconURL()}`)
				.addFields (
					{ name: 'Misc', value: '`howto` `info` `ping` `poll` `server` `text`', inline: true },
					{ name: 'Economy', value: '`addcoins` `coins` `daily` `pay`', inline: true },
					{ name: 'Fun', value: '`8ball` `coinflip` `fish` `ohh` `rps` `triggered`', inline: true },
					{ name: 'Level', value: '`rank` `leaderboard`', inline: true },
					{ name: 'Musik', value: '`loop` `nowplaying` `pause` `play` `queue` `resume` `search` `skip` `stop` `volume`', inline: true },
					{ name: 'Admin', value: '`ban` `deploy` `ismuted` `kick` `mute` `prune` `unban` `unmute`', inline: true },
				);
			return message.channel.send(embed);
		}
		else {
			message.channel.send('<:no:767394810909949983> | Error occured while running help command.');
		}
	},
};