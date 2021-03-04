/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
const economy = require('../../features/economy');
const fish_stats = require('../../features/fish_stats');
const fish_inv = require('../../features/fish_inv');
const fish_rarefish = require('../../features/fish_rarefish');

const cooldowns = new Discord.Collection();

module.exports = {
	minArgs: 0,
	maxArgs: 2,
	expectedArgs: '[inventory | math | redeem <fish> | \nrarefish | sell <type> | stats]',
	description: 'Fischen in Discord! 10 Credits pro Angelversuch',
	callback: async ({ message, args }) => {
		const prefix = process.env.PREFIX;

		const commonPrice = '12'; const uncommonPrice = '20';
		const rarePrice = '1250'; const garbagePrice = '6';
		const pricePerCast = '10';

		if (!args.length) {
			const { member, author } = message;
			const userId = author.id;
			const guildId = message.guild.id;

			const coinsOwned = await economy.getCoins(guildId, member.id);
			if (coinsOwned < pricePerCast) {
				message.channel.send('<:no:767394810909949983> | Du hast nicht genügend Credits!');
				return;
			}
			else {
				if (!cooldowns.has('fish')) {
					cooldowns.set('fish', new Discord.Collection());
				}				const now = Date.now();
				const timestamps = cooldowns.get('fish');
				const cooldownAmount = 30 * 1000;
				if (timestamps.has(message.author.id)) {
					const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
					if (now < expirationTime) {
						const timeLeft = (expirationTime - now) / 1000;
						return message.channel.send(`:fishing_pole_and_fish:  **|  du kannst in ${timeLeft.toFixed(0)} Sekunden wieder fischen.**`);
					}
				}
				timestamps.set(message.author.id, now);
				setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

				const d = Math.random();

				const mess1 = `:fishing_pole_and_fish:  **|**  **${author.username}**, du hast einen `;
				const mess2 = ' gefangen! Du hast **10** 💵 bezahlt.';

				if (d < 0.45 & d > 0.1015) {
					message.channel.send(mess1 + '🐟' + mess2);
					const common = 1;
					const allCommon = await fish_stats.addCommon(userId, common);
					const invCommon = await fish_inv.addCommon(userId, common);
				}
				else if (d < 0.1015 & d > 0.0015) {
					message.channel.send(mess1 + '🐠' + mess2);
					const uncommon = 1;
					const allUncommon = await fish_stats.addUncommon(userId, uncommon);
					const invUncommon = await fish_inv.addUncommon(userId, uncommon);
				}
				else if (d < 0.0015 & d > 0.1015) {
					const rare1 = [
						'🐧', '🐢', '🐙', '🦑', '🦐', '🦀', '🐡', '🐬', '🐳', '🐋', '🦈', '🐊'];
					const randomMessage = rare1[Math.floor(Math.random() * rare1.length)];
					message.channel.send(mess1 + randomMessage + mess2);
					message.reply('du hast einen Rare geangelt! Glückwunsch 🎉');
					const rare = 1;
					const allRare = await fish_stats.addRare(userId, rare);
					const invRare = await fish_inv.addRare(userId, rare);
				}
				else if (d < 1 & d > 0.45) {
					const garbage1 = [
						'🛒', '🔋', '🔧', '👞' ];
					const randomMessage = garbage1[Math.floor(Math.random() * garbage1.length)];
					message.channel.send(mess1 + randomMessage + mess2);
					const garbage = 1;
					const allGarbage = await fish_stats.addGarbage(userId, garbage);
					const invRare = await fish_inv.addGarbage(userId, garbage);
				}
				const remainingCoins = await economy.addCoins(
					guildId,
					member.id,
					pricePerCast * -1,
				);
			}
		}
		else if (args[0] === 'help') {
			const embed = new Discord.MessageEmbed()
				.setTitle('Hilfe zum Fischen | `!fish`')
				.setDescription(`Mit <@772508572647030796> könnt ihr in Discord fischen. Das geht mit \`${prefix}fish\`!\nIhr könnt dabei einen gewöhnlichen, ungewöhnlichen, seltenen Fisch oder Müll angeln.\nEure Statistik könnt ihr mit \`${prefix}fish stats\` abrufen.`)
				.setColor('#00b8ff');
			return message.channel.send(embed);
		}
		else if (args[0] === 'info') {
			const embed = new Discord.MessageEmbed()
				.setColor('#00b8ff')
				.setTitle('**:fishing_pole_and_fish:  |  Info\'s zum Fischen:**')
				.addFields(
					{ name: '• Verkaufspreise:', value: '🐟 : 💴 12, 🐠 : 💴 20, 🦑 : 💴 1250, 🗑️ : 💴 6' },
					{ name: '• Fangraten:', value: '🐟 : 34.85%, 🐠 : 10%, 🦑 : 0.15%, 🗑️ : 55%' },
					{ name: '• Alle seltene Fischarten', value: '🐧, 🐢, 🐙, 🦑, 🦐, 🦀, 🐡, 🐬, 🐳, 🐋, 🦈 und 🐊' },
					{ name: '• Alle Müllarten', value: '🛒, 🔋, 📎, 🔧 und 👞' },
				)
				.setFooter('Falls du eine Übersicht zu den Rollen haben möchtest, probiere mal !fish rollen aus!');
			return message.channel.send(embed);
		}
		else if ((args[0] === 'inv') || (args[0] === 'inventory')) {
			const target = message.mentions.users.first() || message.author;
			const userId = target.id;
			if (target.bot) return;

			const common = await fish_inv.getCommon(userId);
			const uncommon = await fish_inv.getUncommon(userId);
			const garbage = await fish_inv.getGarbage(userId);

			const embed = new Discord.MessageEmbed()
				.setColor('#00b8ff')
				.addField(`:fishing_pole_and_fish:  **|**  **${target.username}'s** Angel-Inventar:`, `🐟 **Gewöhnliche Fische** | ${common}\n🐠 **Ungewöhnliche Fische** | ${uncommon}\n🗑️ **Müll** | ${garbage}`);
			return message.channel.send(embed);
		}
		else if (args[0] === 'math') {
			const target = message.mentions.users.first() || message.author;
			const userId = target.id;
			if (target.bot) return;

			const common = await fish_stats.getCommon(userId); const uncommon = await fish_stats.getUncommon(userId);
			const rare = await fish_stats.getRare(userId); const garbage = await fish_stats.getGarbage(userId);
			const total = (common + uncommon + rare + garbage);

			const mathCommon = Math.round(total * 0.3485); const mathUncommon = Math.round(total * 0.1);
			const mathRare = Math.round(total * 0.0015); const mathGarbage = Math.round(total * 0.55);
			const mathTotal = (mathCommon + mathUncommon + mathRare + mathGarbage);

			const totalPrice = (common * commonPrice) + (uncommon * uncommonPrice) + (rare * rarePrice) + (garbage * garbagePrice);
			const mathTotalPrice = (mathCommon * commonPrice) + (mathUncommon * uncommonPrice) + (mathRare * rarePrice) + (mathGarbage * garbagePrice);

			const embed = new Discord.MessageEmbed()
				.setColor('#00b8ff')
				.setTitle(`:fishing_pole_and_fish:  **|**  **${target.username}'s** Angelstatistik:`)
				.addFields(
					{ name: 'Alle gefangen Fische:', value: `\n🐟 - ${common}\n🐠 - ${uncommon} \n🦑 - ${rare}\n🗑️ - ${garbage}`, inline: true },
					{ name: 'Eigentlich hättest du das:', value: `\n🐟 - ${mathCommon}\n🐠 - ${mathUncommon}\n🦑 - ${mathRare}\n🗑️ - ${mathGarbage}`, inline: true },
					{ name: 'Alle Angelversuche:', value: `Du hast **${total}** Mal gefischt!`, inline: false },
					{ name: 'Deine Fang-Chancen:', value: `\n🐟 - ${Number((common / total) * 100).toFixed(3)}%\n🐠 - ${Number((uncommon / total) * 100).toFixed(3)}%\n🦑 - ${Number((rare / total) * 100).toFixed(3)}%\n🗑️ - ${Number((garbage / total) * 100).toFixed(3)}%`, inline: true },
					{ name: 'Eigentliche Fang-Chancen:', value: '\n🐟 - 34.85%\n🐠 - 10%\n🦑 - 0.15%\n🗑️ - 55%', inline: true },
					{ name: 'Funfact:', value: 'Das Fischen ist eigentlich immer ein Verlust wenn du die Rares nicht verkaufst!', inline: false },
					{ name: 'Dein Umsatz:', value: `Profit: **${Math.round(totalPrice - total * pricePerCast)}** 💵\nOhne Rares: **${Math.round((totalPrice - total * pricePerCast) - rare * rarePrice)}** 💵`, inline: true },
					{ name: 'Eigentlicher Umsatz:', value: `Profit: **${Math.round(mathTotalPrice - mathTotal * pricePerCast)}** 💵\nOhne Rares: **${Math.round((mathTotalPrice - mathTotal * pricePerCast) - mathRare * rarePrice)}** 💵`, inline: true },
					{ name: 'Road to 100 Rares:', value: `Du brauchst aktuell noch **${Math.round(100 / (rare / total)) - total}** Angelversuche (insgesamt **${Math.round(100 / (rare / total))}** Versuche) bis zu den 100 Rares! Weiter so, **${total}** Versuche hast du schon.`, inline: false },
				);
			return message.channel.send(embed);
		}
		else if (args[0] === 'rarefish') {
			const userId = message.author.id;
			const result = await fish_rarefish.resultRarefish(userId);
			return message.channel.send(`:fishing_pole_and_fish:  |  ${message.author.username}'s Sammlung:\n${result}`);
		}
		else if (args[0] === 'redeem') {
			const guildId = message.guild.id;
			const userId = message.author.id;
			const result = await fish_rarefish.check(userId);
			if (result === null) return message.channel.send('Du besitzt keine seltenen Fische!');
			if (!args[1]) return message.channel.send('Versuche es so: `!fish redeem <rare>`');
			const arg = await fish_rarefish.checkArg(args[1]);
			const rare = await fish_rarefish.check(userId);
			if (arg === 'penguin') {
				if (rare.penguin === false) return message.channel.send('Du besitzt diesen seltenen Fisch nicht!');
				await fish_rarefish.redeemPenguin(userId);
				await economy.addCoins(guildId, userId, 1250);
				message.channel.send(`Du hast für deinen ${fish_rarefish.collection.penguin} **1250** 💵 bekommen!`);
			}
			if (arg === 'turtle') {
				if (rare.turtle === false) return message.channel.send('Du besitzt diesen seltenen Fisch nicht!');
				await fish_rarefish.redeemTurtle(userId);
				await economy.addCoins(guildId, userId, 1250);
				message.channel.send(`Du hast für deinen ${fish_rarefish.collection.turtle} **1250** 💵 bekommen!`);
			}
			if (arg === 'octopus') {
				if (rare.octopus === false) return message.channel.send('Du besitzt diesen seltenen Fisch nicht!');
				await fish_rarefish.redeemOctopus(userId);
				await economy.addCoins(guildId, userId, 1250);
				message.channel.send(`Du hast für deinen ${fish_rarefish.collection.octopus} **1250** 💵 bekommen!`);
			}
			if (arg === 'squid') {
				if (rare.squid === false) return message.channel.send('Du besitzt diesen seltenen Fisch nicht!');
				await fish_rarefish.redeemSquid(userId);
				await economy.addCoins(guildId, userId, 1250);
				message.channel.send(`Du hast für deinen ${fish_rarefish.collection.squid} **1250** 💵 bekommen!`);
			}
			if (arg === 'shrimp') {
				if (rare.shrimp === false) return message.channel.send('Du besitzt diesen seltenen Fisch nicht!');
				await fish_rarefish.redeemShrimp(userId);
				await economy.addCoins(guildId, userId, 1250);
				message.channel.send(`Du hast für deinen ${fish_rarefish.collection.shrimp} **1250** 💵 bekommen!`);
			}
			if (arg === 'crab') {
				if (rare.crab === false) return message.channel.send('Du besitzt diesen seltenen Fisch nicht!');
				await fish_rarefish.redeemCrab(userId);
				await economy.addCoins(guildId, userId, 1250);
				message.channel.send(`Du hast für deinen ${fish_rarefish.collection.crab} **1250** 💵 bekommen!`);
			}
			if (arg === 'blowfish') {
				if (rare.blowfish === false) return message.channel.send('Du besitzt diesen seltenen Fisch nicht!');
				await fish_rarefish.redeemBlowfish(userId);
				await economy.addCoins(guildId, userId, 1250);
				message.channel.send(`Du hast für deinen ${fish_rarefish.collection.blowfish} **1250** 💵 bekommen!`);
			}
			if (arg === 'dolphin') {
				if (rare.dolphin === false) return message.channel.send('Du besitzt diesen seltenen Fisch nicht!');
				await fish_rarefish.redeemDolphin(userId);
				await economy.addCoins(guildId, userId, 1250);
				message.channel.send(`Du hast für deinen ${fish_rarefish.collection.dolphin} **1250** 💵 bekommen!`);
			}
			if (arg === 'whale') {
				if (rare.whale === false) return message.channel.send('Du besitzt diesen seltenen Fisch nicht!');
				await fish_rarefish.redeemWhale(userId);
				await economy.addCoins(guildId, userId, 1250);
				message.channel.send(`Du hast für deinen ${fish_rarefish.collection.whale} **1250** 💵 bekommen!`);
			}
			if (arg === 'whale2') {
				if (rare.whale2 === false) return message.channel.send('Du besitzt diesen seltenen Fisch nicht!');
				await fish_rarefish.redeemWhale2(userId);
				await economy.addCoins(guildId, userId, 1250);
				message.channel.send(`Du hast für deinen ${fish_rarefish.collection.whale2} **1250** 💵 bekommen!`);
			}
			if (arg === 'shark') {
				if (rare.shark === false) return message.channel.send('Du besitzt diesen seltenen Fisch nicht!');
				await fish_rarefish.redeemShark(userId);
				await economy.addCoins(guildId, userId, 1250);
				message.channel.send(`Du hast für deinen ${fish_rarefish.collection.shark} **1250** 💵 bekommen!`);
			}
			if (arg === 'crocodile') {
				if (rare.crocodile === false) return message.channel.send('Du besitzt diesen seltenen Fisch nicht!');
				await fish_rarefish.redeemCrocodile(userId);
				await economy.addCoins(guildId, userId, 1250);
				message.channel.send(`Du hast für deinen ${fish_rarefish.collection.crocodile} **1250** 💵 bekommen!`);
			}
		}
		else if ((args[0] === 'rollen') || (args[0] === 'roles')) {
			const embed = new Discord.MessageEmbed()
				.setColor('#00b8ff')
				.setTitle(':fishing_pole_and_fish:  |  Angelrollen:')
				.setDescription('<@&751891268690247741>: 50:squid:, 2,5k :tropical_fish: \n<@&751891490460008500>: 40 :squid:, 2k :tropical_fish: \n<@&751891316547518562>: 30 :squid:, 1,5k :tropical_fish: \n<@&751891200986054707>: 20 :squid:, 1k :tropical_fish: \n<@&751891166823317685>: 15 :squid:, 500 :tropical_fish: \n<@&751891127694655609>: 10 :squid:, 250 :tropical_fish: \n<@&751891101195042846>: 5 :squid:, 125 :tropical_fish: \n<@&751891020634914927>: 0 :squid:, 25 :tropical_fish:')
				.setFooter('Wenn du einen neuen Rang hast, ping einen Admin an. Der gibt dir dann die neue Rolle.');
			return message.channel.send(embed);
		}
		else if (args[0] === 'stats') {
			const target = message.mentions.users.first() || message.author;
			const userId = target.id;
			if (target.bot) return;

			const common = await fish_stats.getCommon(userId);
			const uncommon = await fish_stats.getUncommon(userId);
			const rare = await fish_stats.getRare(userId);
			const garbage = await fish_stats.getGarbage(userId);

			const embed = new Discord.MessageEmbed()
				.setColor('#00b8ff')
				.addField(`:fishing_pole_and_fish:  **|**  **${target.username}'s** Angelstatistik:`, `🐟 **Gewöhnliche Fische** | ${common}\n🐠 **Ungewöhnliche Fische** | ${uncommon}\n🦑 **Seltene Fische** | ${rare}\n🗑️ **Müll** | ${garbage}`);
			return message.channel.send(embed);
		}
		else if (args[0] === 'sell') {
			const target = message.mentions.users.first() || message.author;
			const userId = target.id;
			const guildId = message.guild.id;
			if (target.bot) return;

			const common = await fish_inv.getCommon(userId);
			const uncommon = await fish_inv.getUncommon(userId);
			const garbage = await fish_inv.getGarbage(userId);

			if (args[1] === 'common') {
				await fish_inv.addCommon(userId, common * -1);
				await economy.addCoins(guildId, userId, commonPrice * common);
				return message.channel.send(`:fishing_pole_and_fish:  **|**  Du hast **${common}** gewöhnliche Fische für **${commonPrice * common}** 💵 verkauft.`);
			}
			if (args[1] === 'uncommon') {
				await fish_inv.addUncommon(userId, uncommon * -1);
				await economy.addCoins(guildId, userId, uncommonPrice * uncommon);
				return message.channel.send(`:fishing_pole_and_fish:  **|**  Du hast **${uncommon}** ungewöhnliche Fische für **${uncommonPrice * uncommon}** 💵 verkauft.`);
			}
			if (args[1] === 'garbage') {
				await fish_inv.addGarbage(userId, garbage * -1);
				await economy.addCoins(guildId, userId, garbagePrice * garbage);
				return message.channel.send(`:fishing_pole_and_fish:  **|**  Du hast **${garbage}** Müll für **${garbagePrice * garbage}** 💵 verkauft.`);
			}
			if (args[1] === 'all') {
				await fish_inv.addCommon(userId, common * -1);
				await fish_inv.addUncommon(userId, uncommon * -1);
				await fish_inv.addGarbage(userId, garbage * -1);
				const credits = commonPrice * common + uncommonPrice * uncommon + garbagePrice * garbage;
				await economy.addCoins(guildId, userId, credits);
				return message.channel.send(`:fishing_pole_and_fish:  **|**  Du hast **${common}** gewöhnliche Fische, **${uncommon}** ungewöhnliche Fische und **${garbage}** Müll für **${credits}** 💵 verkauft.`);
			}
		}
		else {
			return message.reply(`versuche es so: \`${prefix}fish\` oder \`${prefix}fish help | info | math | rollen | stats\``);
		}
	},
};