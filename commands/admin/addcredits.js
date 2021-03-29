const { MessageEmbed } = require('discord.js');
const economy = require('../../features/economy');

module.exports = {
	slash: true,
	ownerOnly: true,
	description: 'Fügt einer Person beliebig viele Credits zu',
	options: [
		{
			name: 'user',
			description: 'Beliebiges Servermitglied',
			type: 6,
			required: true,
		},
		{
			name: 'credits',
			description: 'Anzahl der Credits',
			type: 4,
			required: true,
		}
	],
	callback: async ({ client, args, interaction }) => {
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
