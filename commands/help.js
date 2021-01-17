module.exports = {
	category: 'Help',
	description: 'Alle Commands von diesem Bot.',
	expectedArgs: '<command>',
	minArgs: 0,
	maxArgs: 1,
	callback: ({ message, args, instance }) => {
		const Discord = require('discord.js');
		const prefix = instance.getPrefix(message.guild);

		if (!args.length) {
			const embed = new Discord.MessageEmbed()
				.setColor('#f77600')
				.setTitle(`Befehle von ${message.guild.name}`)
				.setDescription(`Tipp: Benutze \`${prefix}help <command>\` um mehr über einen bestimmten Befehl zu erfahren.`)
				.setThumbnail(`${message.guild.iconURL()}`)
				.addFields (
					{ name: 'Allgemein', value: '`ping` `server` `howto` `info` `invite`', inline: true },
					{ name: 'Economy', value: '`addcoins` `coins` `daily` `pay`', inline: true },
					{ name: 'Fun', value: '`8ball` `coinflip` `fish` `ohh` `rps` `triggered`', inline: true },
					{ name: 'Level', value: '`rank` `leaderboard`', inline: true },
					{ name: 'Musik', value: '`loop` `pause` `play` `queue` `resume` `skip` `stop` `volume`', inline: true },
					{ name: 'Mod-Only', value: '`ban` `deploy` `kick` `mod-prefix` `poll` `prune` `reload` `unban`', inline: true },
				);
			return message.channel.send(embed);
		}
		else {
			message.channel.send('<:no:767394810909949983> Error occured while running help command.');
		}
	},
};