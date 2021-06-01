const { coin } = require('../../emoji.json');
const economy = require('../../features/economy');
const { coinflip } = require('../../features/coinflip')

module.exports = {
	description: 'Mache mit einem anderen User einen Coinflip!',
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

		const targetId = args.user;
		const credits = args.credits;

		const target = client.users.cache.get(targetId);

		if (target.bot) return 'Du kannst nicht mit einem Bot spielen!';
		if (userId === targetId) return 'Du kannst doch nicht mit dir selbst spielen!';
		if (credits < 1) return 'Netter Versuch, aber du kannst nicht mit negativen Einsatz spielen!';
		const coinsOwned = await economy.getCoins(guildId, userId);
		if (coinsOwned < credits) return `Du hast doch gar keine ${credits} 💵!`;

		coinflip(client, args, interaction)
		return [ 'Coinflip wird geladen...' ]
	},
};