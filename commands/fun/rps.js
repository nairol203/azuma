const economy = require('../../features/economy');

module.exports = {
	callback: async ({ message, args }) => {
		if (!args.length) return message.channel.send('Lass uns doch um etwas Geld spielen! `!rps <coins>`');
		if ((isNaN(args[0])) || args[0] < 1) return message.channel.send('Bitte setze einen gültigen Betrag!');
		const coinsOwned = await economy.getCoins(message.author.id);
		if (coinsOwned < args[0]) return message.channel.send(`Du hast doch gar keine ${args[0]} Coins <:Susge:809947745342980106>`);

		const acceptedReplies = ['schere', 'stein', 'papier'];
		const random = Math.floor((Math.random() * acceptedReplies.length));
		const result = acceptedReplies[random];

		const drawMessage = 'es ist unendschieden! Gut gespielt! <:FeelsOkayMan:743222752449790054>';
		const loseMessage = `damit habe ich gewonnen und du hast ${args[0]} Coins Verlust gemacht!`;
		const winMessage = `du hast gewonnen! Rip meine ${args[0]} Coins i guess <:Sadge:743222752756105269>`;

		const filter = m => m.author.id === message.author.id;
		message.channel.send('Alles klar, lass uns spielen! Möchtest du Stein, Schere oder Papier nehmen?').then(() => {
			message.channel.awaitMessages(filter, {
				max: 1,
				time: 15000,
				errors: ['time'],
			})
				.then(message => {
					message = message.first();
					if (message.content.toLowerCase() == 'stein') {
						if (result === 'stein') message.channel.send('Ich habe Stein genommen <:pepeLaugh:750018556636168283> <a:TeaTime:786266751909232661>');
						if (result === 'schere') message.channel.send('Ich habe Schere genommen <:pepeLaugh:750018556636168283> <a:TeaTime:786266751909232661>');
						if (result === 'papier') message.channel.send('Ich habe Papier genommen <:pepeLaugh:750018556636168283> <a:TeaTime:786266751909232661>');

						if (result === 'stein') {
							message.reply(drawMessage);
							return;
						}

						if (result === 'papier') {
							message.reply(loseMessage);
							economy.addCoins(message.author.id, args[0] * -1);
							return;
						}
						else {
							message.reply(winMessage);
							economy.addCoins(message.author.id, args[0]);
							return;
						}

					}
					else if (message.content.toLowerCase() == 'schere') {
						if (result === 'stein') message.channel.send('Ich habe Stein genommen <:pepeLaugh:750018556636168283> <a:TeaTime:786266751909232661>');
						if (result === 'schere') message.channel.send('Ich habe Schere genommen <:pepeLaugh:750018556636168283> <a:TeaTime:786266751909232661>');
						if (result === 'papier') message.channel.send('Ich habe Papier genommen <:pepeLaugh:750018556636168283> <a:TeaTime:786266751909232661>');

						if (result === 'schere') {
							message.reply(drawMessage);
							return;
						}

						if (result === 'stein') {
							message.reply(loseMessage);
							economy.addCoins(message.author.id, args[0] * -1);
							return;
						}
						else {
							message.reply(winMessage);
							economy.addCoins(message.author.id, args[0]);
							return;
						}
					}
					else if (message.content.toLowerCase() == 'papier') {
						if (result === 'stein') message.channel.send('Ich habe Stein genommen <:pepeLaugh:750018556636168283> <a:TeaTime:786266751909232661>');
						if (result === 'schere') message.channel.send('Ich habe Schere genommen <:pepeLaugh:750018556636168283> <a:TeaTime:786266751909232661>');
						if (result === 'papier') message.channel.send('Ich habe Papier genommen <:pepeLaugh:750018556636168283> <a:TeaTime:786266751909232661>');

						if (result === 'papier') {
							message.reply(drawMessage);
							return;
						}

						if (result === 'schere') {
							message.reply(loseMessage);
							economy.addCoins(message.author.id, args[0] * -1);
							return;
						}
						else {
							message.reply(winMessage);
							economy.addCoins(message.author.id, args[0]);
							return;
						}

					}
					else {
						message.reply('du musst mit Schere, Stein oder Papier spielen! Versuch es nochmal!');
					}
				})
				.catch(collected => {
					message.reply('du musst mir schon sagen was du nimmst! Versuch es nochmal!');
				});
		});
	},
};