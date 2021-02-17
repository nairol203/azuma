/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
const economy = require('../../features/economy');
const fishing = require('../../features/fishing');
const fishingInv = require('../../features/fishing-inv');

const cooldowns = new Set();

module.exports = {
	callback: async ({ message, args, instance }) => {
		const prefix = instance.getPrefix(message.guild);

		const commonPrice = '12'; const uncommonPrice = '20';
		const rarePrice = '1250'; const garbagePrice = '6';
		const pricePerCast = '10';

		if (!args.length) {
			const { member, author } = message;
			const userId = author.id;

			const coinsOwned = await economy.getCoins(member.id);
			if (coinsOwned < pricePerCast) {
				message.channel.send('<:no:767394810909949983> Du hast nicht genügend Coins!');
				return;
			}
			else {
				if (cooldowns.has(message.author.id)) return message.channel.send(':fishing_pole_and_fish:  **|  du kannst nur alle 30 Sekunden fischen!**');
				cooldowns.add(message.author.id);
				setTimeout(() => cooldowns.delete(message.author.id), 30000);

				const d = Math.random();

				const mess1 = `:fishing_pole_and_fish:  **|**  **${author.username}**, du hast einen `;
				const mess2 = ' gefangen! Du hast **10**<a:Coin:795346652599812147> bezahlt.';

				if (d < 0.45 & d > 0.1015) {
					/* const embed = new Discord.MessageEmbed()
						.setColor('#00b8ff')
						.addField(`:fishing_pole_and_fish:  **|**  **${author.username}**,`, 'du hast einen 🐟 gefangen!\nDu hast **10**<a:Coin:795346652599812147> bezahlt.');
					message.channel.send(embed); */
					message.channel.send(mess1 + '🐟' + mess2);
					const common = 1;
					const allCommon = await fishing.addCommon(userId, common);
					const invCommon = await fishingInv.addCommon(userId, common);
				}
				else if (d < 0.1015 & d > 0.0015) {
					/* const embed = new Discord.MessageEmbed()
						.setColor('#00b8ff')
						.addField(`:fishing_pole_and_fish:  **|**  **${author.username}**,`, 'du hast einen 🐠 gefangen!\nDu hast **10**<a:Coin:795346652599812147> bezahlt.');
					message.channel.send(embed); */
					message.channel.send(mess1 + '🐠' + mess2);
					const uncommon = 1;
					const allUncommon = await fishing.addUncommon(userId, uncommon);
					const invUncommon = await fishingInv.addUncommon(userId, uncommon);
				}
				else if (d < 0.0015 & d > 0.1015) {
					const rare1 = [
						'🐧', '🐢', '🐙', '🦑', '🦐', '🦀', '🐡', '🐬', '🐳', '🐋', '🦈', '🐊'];
					const randomMessage = rare1[Math.floor(Math.random() * rare1.length)];
					/* const embed = new Discord.MessageEmbed()
						.setColor('#00b8ff')
						.addField(`:fishing_pole_and_fish:  **|**  **${author.username}**,`, `du hast einen ${randomMessage} gefangen!\nDu hast **10**<a:Coin:795346652599812147> bezahlt.`);
					message.channel.send(embed); */
					message.channel.send(mess1 + randomMessage + mess2);
					message.reply('du hast einen Rare geangelt! Glückwunsch 🎉');
					const rare = 1;
					const allRare = await fishing.addRare(userId, rare);
					const invRare = await fishingInv.addRare(userId, rare);
				}
				else if (d < 1 & d > 0.45) {
					const garbage1 = [
						'🛒', '🔋', '🔧', '👞' ];
					const randomMessage = garbage1[Math.floor(Math.random() * garbage1.length)];
					/* const embed = new Discord.MessageEmbed()
						.setColor('#00b8ff')
						.addField(`:fishing_pole_and_fish:  **|**  **${author.username}**,`, `du hast einen ${randomMessage} gefangen!\nDu hast **10**<a:Coin:795346652599812147> bezahlt.`);
					message.channel.send(embed); */
					message.channel.send(mess1 + randomMessage + mess2);
					const garbage = 1;
					const allGarbage = await fishing.addGarbage(userId, garbage);
					const invRare = await fishingInv.addGarbage(userId, garbage);
				}
				const remainingCoins = await economy.addCoins(
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
		else if (args[0] === 'inv') {
			const target = message.mentions.users.first() || message.author;
			const userId = target.id;
			if (target.bot) return;

			const common = await fishingInv.getCommon(userId);
			const uncommon = await fishingInv.getUncommon(userId);
			const garbage = await fishingInv.getGarbage(userId);

			const embed = new Discord.MessageEmbed()
				.setColor('#00b8ff')
				.addField(`:fishing_pole_and_fish:  **|**  **${target.username}'s** Angel-Inventar:`, `🐟 **Gewöhnliche Fische** | ${common}\n🐠 **Ungewöhnliche Fische** | ${uncommon}\n🗑️ **Müll** | ${garbage}`);
			return message.channel.send(embed);
		}
		else if (args[0] === 'math') {
			const target = message.mentions.users.first() || message.author;
			const userId = target.id;
			if (target.bot) return;

			const common = await fishing.getCommon(userId); const uncommon = await fishing.getUncommon(userId);
			const rare = await fishing.getRare(userId); const garbage = await fishing.getGarbage(userId);
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
					{ name: 'Dein Umsatz:', value: `Profit: **${Math.round(totalPrice - total * pricePerCast)}** <a:Coin:795346652599812147>\nOhne Rares: **${Math.round((totalPrice - total * pricePerCast) - rare * rarePrice)}** <a:Coin:795346652599812147>`, inline: true },
					{ name: 'Eigentlicher Umsatz:', value: `Profit: **${Math.round(mathTotalPrice - mathTotal * pricePerCast)}** <a:Coin:795346652599812147>\nOhne Rares: **${Math.round((mathTotalPrice - mathTotal * pricePerCast) - mathRare * rarePrice)}** <a:Coin:795346652599812147>`, inline: true },
					{ name: 'Road to 100 Rares:', value: `Du brauchst aktuell noch **${Math.round(100 / (rare / total)) - total}** Angelversuche (insgesamt **${Math.round(100 / (rare / total))}** Versuche) bis zu den 100 Rares! Weiter so, **${total}** Versuche hast du schon.`, inline: false },
				);
			return message.channel.send(embed);
		}
		else if (args[0] === 'rarefish') {
			return message.channel.send('WIP - Coming soon');
		}
		else if (args[0] === 'redeem') {
			return message.channel.send('WIP - Coming soon');
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

			const common = await fishing.getCommon(userId);
			const uncommon = await fishing.getUncommon(userId);
			const rare = await fishing.getRare(userId);
			const garbage = await fishing.getGarbage(userId);

			const embed = new Discord.MessageEmbed()
				.setColor('#00b8ff')
				.addField(`:fishing_pole_and_fish:  **|**  **${target.username}'s** Angelstatistik:`, `🐟 **Gewöhnliche Fische** | ${common}\n🐠 **Ungewöhnliche Fische** | ${uncommon}\n🦑 **Seltene Fische** | ${rare}\n🗑️ **Müll** | ${garbage}`);
			return message.channel.send(embed);
		}
		else if (args[0] === 'sell') {
			const target = message.mentions.users.first() || message.author;
			const userId = target.id;
			if (target.bot) return;

			if (args[1] === 'common') {
				const common = await fishingInv.getCommon(userId);
				const removeCommon = await fishingInv.addCommon(userId, common * -1);
				const newCoins = await economy.addCoins(userId, commonPrice * common);
				return message.channel.send(`:fishing_pole_and_fish:  **|**  Du hast **${common}** gewöhnliche Fische für **${commonPrice * common}**<a:Coin:795346652599812147>verkauft.`);
			}
			if (args[1] === 'uncommon') {
				const uncommon = await fishingInv.getUncommon(userId);
				const removeUncommon = await fishingInv.addUncommon(userId, uncommon * -1);
				const newCoins = await economy.addCoins(userId, uncommonPrice * uncommon);
				return message.channel.send(`:fishing_pole_and_fish:  **|**  Du hast **${uncommon}** ungewöhnliche Fische für **${uncommonPrice * uncommon}**<a:Coin:795346652599812147>verkauft.`);
			}
			if (args[1] === 'garbage') {
				const garbage = await fishingInv.getGarbage(userId);
				const removeGarbage = await fishingInv.addGarbage(userId, garbage * -1);
				const newCoins = await economy.addCoins(userId, garbagePrice * garbage);
				return message.channel.send(`:fishing_pole_and_fish:  **|**  Du hast **${garbage}** Müll für **${garbagePrice * garbage}**<a:Coin:795346652599812147>verkauft.`);
			}
		}
		else {
			return message.reply(`versuche es so: \`${prefix}fish\` oder \`${prefix}fish help | info | math | rollen | stats\``);
		}
	},
};