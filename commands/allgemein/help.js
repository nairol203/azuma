const Discord = require('discord.js');

module.exports = {
	expectedArgs: '<command>',
	minArgs: 0,
	maxArgs: 1,
	callback: ({ message, args }) => {
		const prefix = process.env.PREFIX;
		const data = [];
		const { commands } = message.client;

		if (!args.length) {
			const embed = new Discord.MessageEmbed()
				.setColor('#f77600')
				.setTitle(`Befehle von ${message.guild.name}`)
				.setDescription(`Tipp: Benutze \`${prefix}help <command>\` um mehr über einen bestimmten Befehl zu erfahren.`)
				.setThumbnail(`${message.guild.iconURL()}`)
				.addFields (
					{ name: 'Misc', value: '`cooldowns` `howto` `info` `ping` `server`', inline: true },
					{ name: 'Economy', value: '`credits` `daily` `pay` `business` `work`', inline: true },
					{ name: 'Games', value: '`8ball` `coinflip` `fish` `rps`', inline: true },
					{ name: 'Level', value: '`rank` `leaderboard`', inline: true },
					{ name: 'Musik', value: '`loop` `nowplaying` `pause` `play` `queue` `resume` `search` `skip` `stop` `volume`', inline: true },
					{ name: 'Mod-Only', value: '`ban` `deploy` `ismuted` `kick` `mute` `prune` `unban` `unmute`', inline: true },
				);
			return message.channel.send(embed);
		}
		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('der Befehl konnte nicht gefunden werden.');
		}
		/*
		data.push(`WIP\n**Name:** ${name}`);
		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Beschreibung:** ${command.description}`);
		if (command.expectedArgs) data.push(`**Benutzung:** ${prefix}${command.name} ${command.expectedArgs}`);
		if (command.cooldown) data.push(`**Cooldown:** ${command.cooldown} second(s)`);

		message.channel.send(data, { split: true });*/
		message.channel.send('Dieser Befehl bedindet sich aktuell in der Entwicklung.');
	},
};