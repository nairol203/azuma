const { MessageEmbed } = require('discord.js');
const { rps } = require('../../features/rps')
const economy = require('../../features/economy');

module.exports = {
	description: 'Spiele mit einem anderen Servermitglied eine Partie Schere, Stein, Papier!',
	options: [
		{
			name: 'user',
			description: 'Beliebiges Servermitglied',
			type: 6,
			required: true,
		},
		{
			name: 'credits',
			description: 'Beliebige Anzahl an Credits',
			type: 4,
			required: true,
		},
	],
	callback: async ({ client, args, interaction }) => {
		const guildId = interaction.guild_id;
		const userId = interaction.member.user.id;
		const channel = client.channels.cache.get(interaction.channel_id);

		const targetId = args.user;
		const credits = args.credits;

		const user = client.users.cache.get(userId);
		const target = client.users.cache.get(targetId);

		if (target.bot) return 'Du kannst nicht mit einem Bot spielen!';
		if (userId === targetId) return 'Du kannst doch nicht mit dir selbst spielen!';
		if (credits < 1) return 'Netter Versuch, aber du kannst nicht mit negativen Einsatz spielen!';
		const coinsOwned = await economy.getCoins(guildId, userId);
		if (coinsOwned < credits) return `Du hat nicht genug Credits!`;

		const targetCoins = await economy.getCoins(guildId, targetId);
		if (targetCoins < credits) return `Du kannst ${target.username} nicht herausfordern, da er/sie nicht genug Credits hat!`;
	
		rps(client, args, interaction)
		return [ 'Schere, Stein, Papier wird geladen...' ];
	},
};