const Discord = require('discord.js');
const fish_stats = require('../../features/fish_stats');

module.exports = {
	aliases: ['deploy'],
	minArgs: 5,
	maxArgs: 5,
	expectedArgs: '<member> <common> <uncommon> <rare> <garbage>',
	requiredPermissions: ['ADMINISTRATOR'],
	callback: async ({ message, args }) => {
		const prefix = process.env.PREFIX;

		const mention = message.mentions.users.first();
		if (mention.bot) return;

		if (!mention) {
			message.reply(`versuche es so: \`${prefix}deploy <member> <common> <uncommon> <rare> <garbage>\``);
			return;
		}

		const common = args[1];
		if (isNaN(common)) {
			message.reply(`versuche es so: \`${prefix}deploy <member> <common> <uncommon> <rare> <garbage>\``);
			return;
		}
		const uncommon = args[2];
		if (isNaN(uncommon)) {
			message.reply(`versuche es so: \`${prefix}deploy <member> <common> <uncommon> <rare> <garbage>\``);
			return;
		}
		const rare = args[3];
		if (isNaN(rare)) {
			message.reply(`versuche es so: \`${prefix}deploy <member> <common> <uncommon> <rare> <garbage>\``);
			return;
		}
		const garbage = args[4];
		if (isNaN(garbage)) {
			message.reply(`versuche es so: \`${prefix}deploy <member> <common> <uncommon> <rare> <garbage>\``);
			return;
		}
		const userId = mention.id;

		const newCommon = await fish_stats.setCommon(userId, common);
		const newUncommon = await fish_stats.setUncommon(userId, uncommon);
		const newRare = await fish_stats.setRare(userId, rare);
		const newGarbage = await fish_stats.setGarbage(userId, garbage);

		const embed = new Discord.MessageEmbed()
			.setColor('#00b8ff')
			.addField(`Deploying stats from ${mention.username}`, `Stats werden von Tatsu auf Azuma übertragen...\n**Neue Stats:** ${newCommon} 🐟, ${newUncommon} 🐠, ${newRare} 🦑, ${newGarbage} 🗑️`);
		message.channel.send(embed);
	},
};