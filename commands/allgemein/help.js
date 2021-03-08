const { MessageEmbed } = require('discord.js');

module.exports = {
	slash: true,
	callback: ({ client, args, prefix, interaction }) => {
		const { commands } = client;
		if (!args.command) {
			const guild = client.guilds.cache.get(interaction.guild_id)
			const embed = new MessageEmbed()
				.setColor('#f77600')
				.setTitle(`Befehle von ${guild.name}`)
				.setDescription(`Tipp: Benutze \`${prefix}help <command>\` um mehr über einen bestimmten Befehl zu erfahren.`)
				.setThumbnail(`${guild.iconURL()}`)
				.addFields (
					{ name: 'Misc', value: '`cooldowns` `howto` `info` `ping` `server`', inline: true },
					{ name: 'Economy', value: '`credits` `daily` `pay` `business` `work`', inline: true },
					{ name: 'Games', value: '`8ball` `coinflip` `fish` `rps`', inline: true },
					{ name: 'Level', value: '`rank` `leaderboard`', inline: true },
					{ name: 'Musik', value: '`loop` `nowplaying` `pause` `play` `queue` `resume` `search` `skip` `stop` `volume`', inline: true },
					{ name: 'Mod-Only', value: '`ban` `deploy` `ismuted` `kick` `mute` `prune` `unban` `unmute`', inline: true },
				);
			return embed;
		}
		const name = args.command;
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return 'Der Befehl konnte nicht gefunden werden.';
		}

		const embed = new MessageEmbed()
			.setTitle(prefix + name)
			.setColor('#f77600');

		if (command.description) embed.setDescription(`\`\`\`${command.description}\`\`\``);
		if (command.aliases) embed.addField('Aliases', command.aliases.join(', '));
		if (command.expectedArgs) embed.addField('Benutzung', `\`${prefix + name + ' ' + command.expectedArgs}\``);
		if (command.cooldown) embed.addField('Cooldown', command.cooldown + ' Sekunde(n)');

		return embed;
	},
};