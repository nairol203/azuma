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

		// const randomNumber = [1, 2][Math.floor(Math.random() * 2)];

		
		// client.on('clickButton', async (button) => {
		// 	if (button.id === 'accept') {
		// 	  button.channel.send(`${button.clicker.user.tag} clicked button: JA!`);
		// 	} else if (button.id === 'denied') {
		// 		button.channel.send(`${button.clicker.user.tag} clicked button: NEIN!`);
		// 	  }
		//   });
		  


		// channel.send(`<@${targetId}>, du wurdest zu einem Coinflip von <@${userId}> herausgefordert!\nReagiere innerhalb von 30 Sekunden mit 👍 oder 👎!`).then(async (msg) => {

		// 	await msg.react('👍');
		// 	await msg.react('👎');
		// 	msg.awaitReactions((reaction, user) => user.id == targetId && (reaction.emoji.name == '👍') || (reaction.emoji.name == '👎'),
		// 		{ max: 1, time: 30000 }).then(async collected => {
		// 			switch (collected.first().emoji.name) {
		// 				case '👍':
		// 					const targetCoins = await economy.getCoins(guildId, targetId);
		// 					if (targetCoins < args[1]) return channel.send(`Du kannst nicht teilnehmen da du keine ${args[1]} 💵 hast.`);
		// 					channel.send(coin + ' *flipping...*');
		// 					setTimeout(async function() {
		// 						switch (randomNumber) {
		// 							case 1:
		// 								channel.send(`<@${targetId}> hat ${credits} 💵 gewonnen!`);
		// 								await economy.addCoins(guildId, targetId, credits);
		// 								await economy.addCoins(guildId, userId, credits * -1);
		// 								break;
		// 							case 2:
		// 								channel.send(`<@${userId}> hat ${credits} 💵 gewonnen!`);
		// 								await economy.addCoins(guildId, targetId, credits * -1);
		// 								await economy.addCoins(guildId, userId, credits);
		// 								break;
		// 						};
		// 					}, 1500);
		// 					break;
		// 				default: 
		// 					channel.send(`<@${targetId}>, du hast den Coinflip abgelehnt!`);
		// 					break;
		// 			};
		// 		}).catch(() => {
		// 			return channel.send('Timeout! Bitte anwortet immer innerhalb von 30 Sekunden!');
		// 		});
		// });
	},
};