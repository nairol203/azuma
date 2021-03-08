const { MessageEmbed } = require('discord.js');
const economy = require('../../features/economy');

module.exports = {
	slash: true,
	expectedArgs: '<user> <credits>',
	callback: async ({ args, interaction }) => {
		const authorId = interaction.member.user.id
		const userId = args.user;
		const credits = args.credits;
		const guildId = interaction.guild_id;
		if (credits < 1) return 'Netter Versuch, aber du kannst dir keine Credits yoinken!';
		const creditsOwned = await economy.getCoins(guildId, authorId);
		if (creditsOwned < credits) return 'Du hast leider nicht genug Credits!';
		const remainingCredits = await economy.addCoins(guildId, authorId, credits * -1);
		const newBalance = await economy.addCoins(guildId, userId, credits)

		const embed = new MessageEmbed()
		 	.setColor('#f77600')
		 	.addField(`💵  |  **${interaction.member.nick}**,`, `du hast <@${userId}> bezahlt.\n<@${userId}> hat jetzt **${newBalance}** Credit(s) und du hast noch **${remainingCredits}** Credit(s)!`);
		return embed;

		// const { guild, member } = message;
		// const prefix = process.env.PREFIX;

		// const target = message.mentions.users.first();
		// if (!target) {
		// 	message.channel.send(`<:no:767394810909949983> Ungültiger Befehl, versuche es so: \`${prefix}pay <user> <credits>\``);
		// 	return;
		// }
		// if (target.bot) return;

		// const coinsToGive = args[1];
		// if ((isNaN(args[1])) || args[1] < 1) {
		// 	message.channel.send(`<:no:767394810909949983> Ungültiger Befehl, versuche es so: \`${prefix}pay <user> <credits>\``);
		// 	return;
		// }

		// const coinsOwned = await economy.getCoins(guild.id, member.id);
		// if (coinsOwned < coinsToGive) {
		// 	message.channel.send(`<:no:767394810909949983> Du hast nicht ${coinsToGive} credits!`);
		// 	return;
		// }

		// const remainingCoins = await economy.addCoins(
		// 	guild.id,
		// 	member.id,
		// 	coinsToGive * -1,
		// );
		// const newBalance = await economy.addCoins(guild.id, target.id, coinsToGive);

		// const embed = new Discord.MessageEmbed()
		// 	.setColor('#f77600')
		// 	.addField(`💵  |  **${message.author.username}**,`, `du hast <@${target.id}> bezahlt.\n<@${target.id}> hat jetzt **${newBalance}** Credit(s) und du hast noch **${remainingCoins}** Credit(s)!`);
		// message.channel.send(embed);
	},
};
