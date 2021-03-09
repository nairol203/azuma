const { MessageEmbed } = require('discord.js');
const economy = require('../../features/economy');

module.exports = {
	slash: true,
	ownerOnly: true,
	requiredPermissions: ['ADMINISTRATOR'],
	callback: async ({ client, args, prefix, interaction }) => {
		const userId = args.user;
		const credits = args.credits;
		const guild = client.guilds.cache.get(interaction.guild_id);

		const newBalance = await economy.addCoins(guild.id, userId, credits)

		const embed = new MessageEmbed()
			.setColor('#f77600')
			.addField(`💵  |  **${interaction.member.user.username}**,`, `du hast <@${userId}> **${credits}** Credit(s) gegeben.\n<@${userId}> hat jetzt **${newBalance}** Credit(s)!`);
		return embed;
	},
};
