const economy = require('../../features/economy');

module.exports = {
	callback: async ({ message, args }) => {
		const target = message.mentions.users.first();
		const test = message.author;
		if (!target) return message.reply('`!coinflip <@user> <coins>`');
		if (!args[1]) return message.reply('du musst schon etwas Geld setzen! -> `!coinflip <@user> <coins>`');
		if (target.id === test.id) return message.channel.send('Du kannst doch nicht mit dir selbst spielen <:FeelsDankMan:780215649384398908>');

		if ((isNaN(args[1])) || args[1] < 1) return message.channel.send('Bitte setze einen gültigen Betrag!');
		const coinsOwned = await economy.getCoins(message.author.id);
		if (coinsOwned < args[1]) return message.channel.send(`Du hast doch gar keine ${args[1]} Coins <:Susge:809947745342980106>`);

		const messages = ['zahl', 'kopf'];
		const randomMessage = messages[Math.floor(Math.random() * messages.length)];

		const filter = m => m.author.id === target.id;
		message.channel.send(`${target}, du wurdest zu einem Coinflip von ${message.author} herausgefordert!\nSchreibe \`accept\` oder \`deny\`!`).then(() => {
			message.channel.awaitMessages(filter, {
				max: 1,
				time: 30000,
				errors: ['time'],
			})
				.then(async message => {
					message = message.first();
					if (message.content.toLowerCase() == 'accept') {
						const targetCoins = await economy.getCoins(target.id);
						if (targetCoins < args[1]) return message.channel.send(`Du kannst nicht teilnehmen da du keine ${args[1]} Coins hast <:Susge:809947745342980106>`);

						message.channel.send('<a:Coin:795346652599812147>*flipping...*');

						setTimeout(async function() {
							if(randomMessage === 'zahl') {
								message.channel.send(`${target} hat ${args[1]} Coins gewonnen!`);
								await economy.addCoins(target.id, args[1]);
								await economy.addCoins(test.id, args[1] * -1);
							}
							if(randomMessage === 'kopf') {
								message.channel.send(`${test} hat ${args[1]} Coins gewonnen!`);
								await economy.addCoins(target.id, args[1] * -1);
								await economy.addCoins(test.id, args[1]);
							}
						}, 1500);
						return;
					}
					if (message.content.toLowerCase() == 'deny') {
						return message.channel.send(`${target} hat den Coinflip abgelehnt!`);
					}
					else {
						return message.channel.send(`${target}, du hast nicht \`accept\` oder \`deny\` geschrieben!`);
					}
				})
				.catch(collected => {
					return message.channel.send('Timeout! Bitte anwortet immer innerhalb von 30 Sekunden!');
				});
		});
	},
};