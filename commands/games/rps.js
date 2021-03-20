const { MessageEmbed } = require('discord.js');
const economy = require('../../features/economy');

module.exports = {
	slash: true,
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
		if (coinsOwned < credits) return `Du hast doch gar keine ${credits} 💵!`;

		const embed = new MessageEmbed()
			.setTitle('Schere, Stein, Papier')
			.setDescription(`${target} du wurdest zu einem Spiel herausgefordert!\nReagiere um teilzunehmen!`)
			.addField('Einsatz', `\`${credits}\` 💵`)
			.setFooter('Nach 30 Sekunden verfällt die Herausforderung');

		channel.send(embed).then(async (msg) => {
			await msg.react('👍');
			await msg.react('👎');
			msg.awaitReactions((reaction, user) => user.id == targetId && (reaction.emoji.name == '👍') || (reaction.emoji.name == '👎'),
				{ max: 1, time: 30000 }).then(async collected => {
					switch (collected.first().emoji.name) {
						case '👍':
							const targetCoins = await economy.getCoins(guildId, targetId);
							if (targetCoins < credits) return channel.send(`Du kannst nicht teilnehmen da du keine ${credits} 💵 hast!`);

							channel.send('Ich werde euch nacheinander per DM fragen, was ihr nimmt! Anwortet bitte jeweils innerhalb von 15 Sekunden!');
		
							const msg = await user.send('Nimmst du Schere, Stein oder Papier?');
							const filter1 = collected => collected.author.id === userId;
							const collected = await msg.channel.awaitMessages(filter1, {
								max: 1,
								time: 15000,
							});
							const msg1 = await target.send('Nimmst du Schere, Stein oder Papier?');
							const filter2 = collected1 => collected1.author.id === targetId;
							const collected1 = await msg1.channel.awaitMessages(filter2, {
								max: 1,
								time: 15000,
							});
							console.log(collected, collected1)

							if(collected.first().content.toLowerCase() === 'stein') {
								const embed = new MessageEmbed()
									.setTitle('Schere, Stein, Papier')
									.setDescription('Ihr habt beide Stein genommen!')
									.addFields(
										{ name: 'Einsatz', value: `\`${credits}\` 💵` },
										{ name: 'Gewinner', value: 'keiner' },
									);
								if(collected1.first().content.toLowerCase() === 'stein') return channel.send(embed);
								if(collected1.first().content.toLowerCase() === 'schere') {
									await economy.addCoins(guildId, userId, credits);
									await economy.addCoins(guildId, targetId, credits * -1);

									const embed = new MessageEmbed()
										.setTitle('Schere, Stein, Papier')
										.setDescription(`${user} hat Stein genommen und ${target} Schere!`)
										.addFields(
											{ name: 'Einsatz', value: `\`${credits}\` 💵` },
											{ name: 'Gewinner', value: `${user} ` },
										);
									channel.send(embed);
								}
								if(collected1.first().content.toLowerCase() === 'papier') {
									await economy.addCoins(guildId, userId, credits * -1);
									await economy.addCoins(guildId, targetId, credits);

									const embed = new MessageEmbed()
										.setTitle('Schere, Stein, Papier')
										.setDescription(`${user} hat Stein genommen und ${target} Papier!`)
										.addFields(
											{ name: 'Einsatz', value: `\`${credits}\` 💵` },
											{ name: 'Gewinner', value: `${target}` },
										);
									channel.send(embed);
								}
							}
							if(collected.first().content.toLowerCase() === 'schere') {
								const embed = new MessageEmbed()
									.setTitle('Schere, Stein, Papier')
									.setDescription('Ihr habt beide Schere genommen!')
									.addFields(
										{ name: 'Einsatz', value: `\`${credits}\` 💵` },
										{ name: 'Gewinner', value: 'keiner' },
									);
								if(collected1.first().content.toLowerCase() === 'schere') return channel.send(embed);
								if(collected1.first().content.toLowerCase() === 'papier') {
									await economy.addCoins(guildId, userId, credits);
									await economy.addCoins(guildId, targetId, credits * -1);

									const embed = new MessageEmbed()
										.setTitle('Schere, Stein, Papier')
										.setDescription(`${user} hat Schere genommen und ${target} Papier!`)
										.addFields(
											{ name: 'Einsatz', value: `\`${credits}\` 💵` },
											{ name: 'Gewinner', value: `${author}` },
										);
									channel.send(embed);
								}
								if(collected1.first().content.toLowerCase() === 'stein') {
									await economy.addCoins(guildId, userId, credits * -1);
									await economy.addCoins(guildId, targetId, credits);

									const embed = new MessageEmbed()
										.setTitle('Schere, Stein, Papier')
										.setDescription(`${user} hat Schere genommen und ${target} Stein!`)
										.addFields(
											{ name: 'Einsatz', value: `\`${credits}\` 💵` },
											{ name: 'Gewinner', value: `${target}` },
										);
									channel.send(embed);
								}
							}
							if(collected.first().content.toLowerCase() === 'papier') {
								const embed = new MessageEmbed()
									.setTitle('Schere, Stein, Papier')
									.setDescription('Ihr habt beide Papier genommen!')
									.addFields(
										{ name: 'Einsatz', value: `\`${credits}\` 💵` },
										{ name: 'Gewinner', value: 'keiner' },
									);
								if(collected1.first().content.toLowerCase() === 'papier') return channel.send(embed);
								if(collected1.first().content.toLowerCase() === 'stein') {
									await economy.addCoins(guildId, userId, credits);
									await economy.addCoins(guildId, targetId, credits * -1);

									const embed = new MessageEmbed()
										.setTitle('Schere, Stein, Papier')
										.setDescription(`${user} hat Papier genommen und ${target} Stein!`)
										.addFields(
											{ name: 'Einsatz', value: `\`${credits}\` 💵` },
											{ name: 'Gewinner', value: `${author}` },
										);
									channel.send(embed);
								}
								if(collected1.first().content.toLowerCase() === 'schere') {
									await economy.addCoins(guildId, userId, credits * -1);
									await economy.addCoins(guildId, targetId, credits);

									const embed = new MessageEmbed()
										.setTitle('Schere, Stein, Papier')
										.setDescription(`${user} hat Papier genommen und ${target} Schere!`)
										.addFields(
											{ name: 'Einsatz', value: `\`${credits}\` 💵` },
											{ name: 'Gewinner', value: `${target}` },
										);
									channel.send(embed);
								}
							}
							break;
						default: 
							channel.send(`${target}, du hast den Coinflip abgelehnt!`);
							break;
					}
				}).catch(() => {
					return channel.send(`${target} hat nicht innerhalb von 30 Sekunden reagiert!`);
				});
		});
	},
};