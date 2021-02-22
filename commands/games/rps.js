const Discord = require('discord.js');
const economy = require('../../features/economy');

module.exports = {
	callback: async ({ message, args }) => {
		const target = message.mentions.users.first();
		const guildId = message.guild.id;
		const test = message.author;
		if (target) {
			if (!args[1]) return message.channel.send('Lass uns doch um etwas Geld spielen! `!rps <user> <coins>`');
			if (target.id === test.id) return message.channel.send('Du kannst doch nicht mit dir selbst spielen <:FeelsDankMan:780215649384398908>');

			if ((isNaN(args[1])) || args[1] < 1) return message.channel.send('Bitte setze einen gültigen Betrag!');
			const coinsOwned = await economy.getCoins(guildId, message.author.id);
			if (coinsOwned < args[1]) return message.channel.send(`Du hast doch gar keine ${args[1]} Coins <:Susge:809947745342980106>`);

			const filter = m => m.author.id === target.id;

			const embed = new Discord.MessageEmbed()
				.setTitle('Schere, Stein, Papier')
				.setDescription(`${target}, du wurdest zu einem Spiel herausgefordert!\nTippe \`accept\` um teilzunehmen!`)
				.addField('Einsatz', `\`${args[1]}\` 💵`)
				.setFooter('Nach 30 Sekunden verfällt die Herausforderung');
			message.channel.send(embed).then(() => {
				message.channel.awaitMessages(filter, {
					max: 1,
					time: 30000,
					errors: ['time'],
				})
					.then(async message => {
						message = message.first();
						if (message.content.toLowerCase() == 'accept') {
							const targetCoins = await economy.getCoins(guildId, target.id);
							if (targetCoins < args[1]) return message.channel.send(`Du kannst nicht teilnehmen da du keine ${args[1]} 💵 hast!`);

							message.channel.send('Ich werde euch nacheinander per DM fragen, was ihr nimmt! Anwortet bitte jeweils innerhalb von 15 Sekunden!');

							const msg = await test.send('Nimmst du Schere, Stein oder Papier?');
							const filter1 = collected => collected.author.id === test.id;
							const collected = await msg.channel.awaitMessages(filter1, {
								max: 1,
								time: 15000,
							});

							const msg1 = await message.author.send('Nimmst du Schere, Stein oder Papier?');
							const filter2 = collected1 => collected1.author.id === target.id;
							const collected1 = await msg1.channel.awaitMessages(filter2, {
								max: 1,
								time: 15000,
							});

							if(collected.first().content.toLowerCase() === 'stein') {
								const embed = new Discord.MessageEmbed()
									.setTitle('Schere, Stein, Papier')
									.setDescription('Ihr habt beide Stein genommen!')
									.addFields(
										{ name: 'Einsatz', value: `\`${args[1]}\` 💵` },
										{ name: 'Gewinner', value: 'keiner' },
									);
								if(collected1.first().content.toLowerCase() === 'stein') return message.channel.send(embed);
								if(collected1.first().content.toLowerCase() === 'schere') {
									await economy.addCoins(guildId, test.id, args[1]);
									await economy.addCoins(guildId, target.id, args[1] * -1);

									const embed = new Discord.MessageEmbed()
										.setTitle('Schere, Stein, Papier')
										.setDescription(`${test} hat Stein genommen und ${target} Schere!`)
										.addFields(
											{ name: 'Einsatz', value: `\`${args[1]}\` 💵` },
											{ name: 'Gewinner', value: `${test}` },
										);
									message.channel.send(embed);
								}
								if(collected1.first().content.toLowerCase() === 'papier') {
									await economy.addCoins(guildId, test.id, args[1] * -1);
									await economy.addCoins(guildId, target.id, args[1]);

									const embed = new Discord.MessageEmbed()
										.setTitle('Schere, Stein, Papier')
										.setDescription(`${test} hat Stein genommen und ${target} Papier!`)
										.addFields(
											{ name: 'Einsatz', value: `\`${args[1]}\` 💵` },
											{ name: 'Gewinner', value: `${target}` },
										);
									message.channel.send(embed);
								}
							}
							if(collected.first().content.toLowerCase() === 'schere') {
								const embed = new Discord.MessageEmbed()
									.setTitle('Schere, Stein, Papier')
									.setDescription('Ihr habt beide Schere genommen!')
									.addFields(
										{ name: 'Einsatz', value: `\`${args[1]}\` 💵` },
										{ name: 'Gewinner', value: 'keiner' },
									);
								if(collected1.first().content.toLowerCase() === 'schere') return message.channel.send(embed);
								if(collected1.first().content.toLowerCase() === 'papier') {
									await economy.addCoins(guildId, test.id, args[1]);
									await economy.addCoins(guildId, target.id, args[1] * -1);

									const embed = new Discord.MessageEmbed()
										.setTitle('Schere, Stein, Papier')
										.setDescription(`${test} hat Schere genommen und ${target} Papier!`)
										.addFields(
											{ name: 'Einsatz', value: `\`${args[1]}\` 💵` },
											{ name: 'Gewinner', value: `${test}` },
										);
									message.channel.send(embed);
								}
								if(collected1.first().content.toLowerCase() === 'stein') {
									await economy.addCoins(guildId, test.id, args[1] * -1);
									await economy.addCoins(guildId, target.id, args[1]);

									const embed = new Discord.MessageEmbed()
										.setTitle('Schere, Stein, Papier')
										.setDescription(`${test} hat Schere genommen und ${target} Stein!`)
										.addFields(
											{ name: 'Einsatz', value: `\`${args[1]}\` 💵` },
											{ name: 'Gewinner', value: `${target}` },
										);
									message.channel.send(embed);
								}
							}
							if(collected.first().content.toLowerCase() === 'papier') {
								const embed = new Discord.MessageEmbed()
									.setTitle('Schere, Stein, Papier')
									.setDescription('Ihr habt beide Papier genommen!')
									.addFields(
										{ name: 'Einsatz', value: `\`${args[1]}\` 💵` },
										{ name: 'Gewinner', value: 'keiner' },
									);
								if(collected1.first().content.toLowerCase() === 'papier') return message.channel.send(embed);
								if(collected1.first().content.toLowerCase() === 'stein') {
									await economy.addCoins(guildId, test.id, args[1]);
									await economy.addCoins(guildId, target.id, args[1] * -1);

									const embed = new Discord.MessageEmbed()
										.setTitle('Schere, Stein, Papier')
										.setDescription(`${test} hat Papier genommen und ${target} Stein!`)
										.addFields(
											{ name: 'Einsatz', value: `\`${args[1]}\` 💵` },
											{ name: 'Gewinner', value: `${test}` },
										);
									message.channel.send(embed);
								}
								if(collected1.first().content.toLowerCase() === 'schere') {
									await economy.addCoins(guildId, test.id, args[1] * -1);
									await economy.addCoins(guildId, target.id, args[1]);

									const embed = new Discord.MessageEmbed()
										.setTitle('Schere, Stein, Papier')
										.setDescription(`${test} hat Papier genommen und ${target} Schere!`)
										.addFields(
											{ name: 'Einsatz', value: `\`${args[1]}\` 💵` },
											{ name: 'Gewinner', value: `${target}` },
										);
									message.channel.send(embed);
								}
							}
						}
						else {
							message.channel.send('<:no:767394810909949983> | Du hast nicht `accept` geschrieben!');
						}
					})
					.catch(collected => {
						message.channel.send('<:no:767394810909949983> | Timeout! Bitte anwortet immer innerhalb von 15 Sekunden!');
					});
			});
			return;
		}

		if (!args.length) return message.channel.send('<:no:767394810909949983> | Lass uns doch um etwas Geld spielen! `!rps <coins>`');

		if ((isNaN(args[0])) || args[0] < 1) return message.channel.send('<:no:767394810909949983> | Bitte setze einen gültigen Betrag!');
		const coinsOwned = await economy.getCoins(message.author.id);
		if (coinsOwned < args[0]) return message.channel.send(`<:no:767394810909949983> | Du hast doch gar keine ${args[0]} Coins <:Susge:809947745342980106>`);

		const acceptedReplies = ['Schere', 'Stein', 'Papier'];
		const random = Math.floor((Math.random() * acceptedReplies.length));
		const result = acceptedReplies[random];

		const resultMessage = `Ich habe ${result} genommen <:pepeLaugh:750018556636168283> <a:TeaTime:786266751909232661>`;
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
						message.channel.send(resultMessage);


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
						message.channel.send(resultMessage);

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
						message.channel.send(resultMessage);

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