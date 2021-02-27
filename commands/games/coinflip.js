const economy = require('../../features/economy');

module.exports = {
	callback: async ({ message, args }) => {
		const target = message.mentions.users.first();
		const { author, channel, guild } = message;
		const guildId = guild.id;

		if (!target) return message.reply('`!coinflip <@user> <credits>`');
		if (!args[1]) return message.reply('du musst schon etwas Geld setzen! -> `!coinflip <@user> <credits>`');
		if (target.id === author.id) return channel.send('Du kannst doch nicht mit dir selbst spielen <:FeelsDankMan:780215649384398908>');

		if ((isNaN(args[1])) || args[1] < 1) return channel.send('Bitte setze einen gültigen Betrag!');
		const coinsOwned = await economy.getCoins(guildId, author.id);
		if (coinsOwned < args[1]) return channel.send(`Du hast doch gar keine ${args[1]} 💵!`);

		const messages = ['zahl', 'kopf'];
		const randomMessage = messages[Math.floor(Math.random() * messages.length)];

		const filter = m => m.author.id === target.id;
		channel.send(`${target}, du wurdest zu einem Coinflip von ${author} herausgefordert!\nSchreibe \`accept\` oder \`deny\`!`).then(() => {
			channel.awaitMessages(filter, {
				max: 1,
				time: 30000,
				errors: ['time'],
			})
				.then(async message => {
					message = message.first();
					if (message.content.toLowerCase() == 'accept') {
						const targetCoins = await economy.getCoins(guildId, target.id);
						if (targetCoins < args[1]) return channel.send(`Du kannst nicht teilnehmen da du keine ${args[1]} 💵 hast.`);

						channel.send('<a:Coin:795346652599812147>*flipping...*');

						setTimeout(async function() {
							if(randomMessage === 'zahl') {
								channel.send(`${target} hat ${args[1]} 💵 gewonnen!`);
								await economy.addCoins(guildId, target.id, args[1]);
								await economy.addCoins(guildId, author.id, args[1] * -1);
							}
							if(randomMessage === 'kopf') {
								channel.send(`${author} hat ${args[1]} 💵 gewonnen!`);
								await economy.addCoins(guildId, target.id, args[1] * -1);
								await economy.addCoins(guildId, author.id, args[1]);
							}
						}, 1500);
						return;
					}
					if (message.content.toLowerCase() == 'deny') {
						return channel.send(`${target} hat den Coinflip abgelehnt!`);
					}
					else {
						return channel.send(`${target}, du hast nicht \`accept\` oder \`deny\` geschrieben!`);
					}
				})
				.catch(collected => {
					return channel.send('Timeout! Bitte anwortet immer innerhalb von 30 Sekunden!');
				});
		});
	},
};