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
		 	.addField(`💵  |  **${interaction.member.user.username}**,`, `du hast <@${userId}> bezahlt.\n<@${userId}> hat jetzt **${newBalance}** Credit(s) und du hast noch **${remainingCredits}** Credit(s)!`);
		return embed;
	},
};
