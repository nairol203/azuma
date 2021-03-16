const { Collection, MessageEmbed } = require('discord.js');
const { no } = require('../../emoji.json');

const economy = require('../../features/economy');
const fish_stats = require('../../features/fish_stats');
const fish_inv = require('../../features/fish_inv');
const fish_rarefish = require('../../features/fish_rarefish');

const cooldowns = new Collection();

const price = {
	common: 12,
	uncommon: 20,
	rare: 1250,
	garbage: 6,
	perCast: 10,
};

module.exports = {
	slash: true,
	description: 'Angle in Discord ein paar Fische!',
	options: [
		{
			name: 'options',
			description: 'Angle in Discord ein paar Fische!',
			type: 3,
			choices: [
                {
                    name: 'inventory',
                    value: 'inventory',
                },
				{
                    name: 'math',
                    value: 'math',
                },
				{
                    name: 'rarefish',
                    value: 'rarefish',
                },
				{
                    name: 'redeem',
                    value: 'redeem',
                },
				{
                    name: 'sell',
                    value: 'sell',
                },
				{
                    name: 'stats',
                    value: 'stats',
                },
            ]
		},
		{
			name: 'type',
			description: 'Nur bei redeem und sell benötigt!',
			type: 3,
		},
	],
	callback: async ({ args, interaction }) => {
		const guildId = interaction.guild_id;
		const user = interaction.member.user;
		const userId = user.id;

		if (args.arguments === 'inventory') {
			const common = await fish_inv.getCommon(userId);
			const uncommon = await fish_inv.getUncommon(userId);
			const garbage = await fish_inv.getGarbage(userId);

			return `:fishing_pole_and_fish:  **|**  ${user.username}'s Angelinventar:\n🐟 **Gewöhnliche Fische** | ${common}\n🐠 **Ungewöhnliche Fische** | ${uncommon}\n🗑️ **Müll** | ${garbage}`;
		}
		else if (args.options === 'math') {
			const common = await fish_stats.getCommon(userId); const uncommon = await fish_stats.getUncommon(userId);
			const rare = await fish_stats.getRare(userId); const garbage = await fish_stats.getGarbage(userId);
			const total = (common + uncommon + rare + garbage);

			const mathCommon = Math.round(total * 0.3485); const mathUncommon = Math.round(total * 0.1);
			const mathRare = Math.round(total * 0.0015); const mathGarbage = Math.round(total * 0.55);
			const mathTotal = (mathCommon + mathUncommon + mathRare + mathGarbage);

			const totalPrice = (common * price.common) + (uncommon * price.uncommon) + (rare * price.rare) + (garbage * price.garbage);
			const mathTotalPrice = (mathCommon * price.common) + (mathUncommon * price.uncommon) + (mathRare * price.rare) + (mathGarbage * price.garbage);

			const embed = new MessageEmbed()
				.setColor('#00b8ff')
				.setTitle(`:fishing_pole_and_fish:  **|**  **${user.username}'s** Angelstatistik:`)
				.addFields(
					{ name: 'Alle gefangen Fische:', value: `\n🐟 - ${common}\n🐠 - ${uncommon} \n🦑 - ${rare}\n🗑️ - ${garbage}`, inline: true },
					{ name: 'Eigentlich hättest du das:', value: `\n🐟 - ${mathCommon}\n🐠 - ${mathUncommon}\n🦑 - ${mathRare}\n🗑️ - ${mathGarbage}`, inline: true },
					{ name: 'Alle Angelversuche:', value: `Du hast **${total}** Mal gefischt!`, inline: false },
					{ name: 'Deine Fang-Chancen:', value: `\n🐟 - ${Number((common / total) * 100).toFixed(3)}%\n🐠 - ${Number((uncommon / total) * 100).toFixed(3)}%\n🦑 - ${Number((rare / total) * 100).toFixed(3)}%\n🗑️ - ${Number((garbage / total) * 100).toFixed(3)}%`, inline: true },
					{ name: 'Eigentliche Fang-Chancen:', value: '\n🐟 - 34.85%\n🐠 - 10%\n🦑 - 0.15%\n🗑️ - 55%', inline: true },
					{ name: 'Funfact:', value: 'Das Fischen ist eigentlich immer ein Verlust wenn du die Rares nicht verkaufst!', inline: false },
					{ name: 'Dein Umsatz:', value: `Profit: **${Math.round(totalPrice - total * price.perCast)}** 💵\nOhne Rares: **${Math.round((totalPrice - total * price.perCast) - rare * price.rare)}** 💵`, inline: true },
					{ name: 'Eigentlicher Umsatz:', value: `Profit: **${Math.round(mathTotalPrice - mathTotal * price.perCast)}** 💵\nOhne Rares: **${Math.round((mathTotalPrice - mathTotal * price.perCast) - mathRare * price.rare)}** 💵`, inline: true },
					{ name: 'Road to 100 Rares:', value: `Du brauchst aktuell noch **${Math.round(100 / (rare / total)) - total}** Angelversuche (insgesamt **${Math.round(100 / (rare / total))}** Versuche) bis zu den 100 Rares! Weiter so, **${total}** Versuche hast du schon.`, inline: false },
				);
			return embed;
		}
		else if (args.options === 'rarefish') {
			const result = await fish_rarefish.resultRarefish(userId);
			return `:fishing_pole_and_fish:  |  ${user.username}'s Sammlung:\n${result}`;
		}
		else if (args.options === 'redeem') {
			if (!args.type) return 'Du musst einen Fisch definieren, den du einlösen möchtest!';
			const result = await fish_rarefish.check(userId);
			if (result === null) return 'Du besitzt keine seltenen Fische!';
			const arg = await fish_rarefish.checkArg(args.type);
			const rare = await fish_rarefish.check(userId);
			switch (arg) {
			case 'penguin':
				if (rare.penguin === false) return 'Du besitzt diesen seltenen Fisch nicht!';
				await fish_rarefish.redeemPenguin(userId);
				await economy.addCoins(guildId, userId, 1250);
				return 'Du hast für deinen' + fish_rarefish.collection.penguin + price.rare + '💵 bekommen!';
			case 'turtle':
				if (rare.turtle === false) return 'Du besitzt diesen seltenen Fisch nicht!';
				await fish_rarefish.redeemTurtle(userId);
				await economy.addCoins(guildId, userId, 1250);
				return 'Du hast für deinen' + fish_rarefish.collection.turtle + price.rare + '💵 bekommen!';
			case 'octopus':
				if (rare.octopus === false) return 'Du besitzt diesen seltenen Fisch nicht!';
				await fish_rarefish.redeemOctopus(userId);
				await economy.addCoins(guildId, userId, 1250);
				return 'Du hast für deinen' + fish_rarefish.collection.octopus + price.rare + '💵 bekommen!';
			case 'squid':
				if (rare.squid === false) return 'Du besitzt diesen seltenen Fisch nicht!';
				await fish_rarefish.redeemSquid(userId);
				await economy.addCoins(guildId, userId, 1250);
				return 'Du hast für deinen' + fish_rarefish.collection.squid + price.rare + '💵 bekommen!';
			case 'shrimp':
				if (rare.shrimp === false) return 'Du besitzt diesen seltenen Fisch nicht!';
				await fish_rarefish.redeemShrimp(userId);
				await economy.addCoins(guildId, userId, 1250);
				return 'Du hast für deinen' + fish_rarefish.collection.shrimp + price.rare + '💵 bekommen!';
			case 'crab':
				if (rare.crab === false) return 'Du besitzt diesen seltenen Fisch nicht!';
				await fish_rarefish.redeemCrab(userId);
				await economy.addCoins(guildId, userId, 1250);
				return 'Du hast für deinen' + fish_rarefish.collection.crab + price.rare + '💵 bekommen!';
			case 'blowfish':
				if (rare.blowfish === false) return 'Du besitzt diesen seltenen Fisch nicht!';
				await fish_rarefish.redeemBlowfish(userId);
				await economy.addCoins(guildId, userId, 1250);
				return 'Du hast für deinen' + fish_rarefish.collection.blowfish + price.rare + '💵 bekommen!';
			case 'dolphin':
				if (rare.dolphin === false) return 'Du besitzt diesen seltenen Fisch nicht!';
				await fish_rarefish.redeemDolphin(userId);
				await economy.addCoins(guildId, userId, 1250);
				return 'Du hast für deinen' + fish_rarefish.collection.dolphin + price.rare + '💵 bekommen!';
			case 'whale':
				if (rare.whale === false) return 'Du besitzt diesen seltenen Fisch nicht!';
				await fish_rarefish.redeemWhale(userId);
				await economy.addCoins(guildId, userId, 1250);
				return 'Du hast für deinen' + fish_rarefish.collection.whale + price.rare + '💵 bekommen!';
			case 'whale2':
				if (rare.whale2 === false) return 'Du besitzt diesen seltenen Fisch nicht!';
				await fish_rarefish.redeemWhale2(userId);
				await economy.addCoins(guildId, userId, 1250);
				return 'Du hast für deinen' + fish_rarefish.collection.whale2 + price.rare + '💵 bekommen!';
			case 'shark':
				if (rare.shark === false) return 'Du besitzt diesen seltenen Fisch nicht!';
				await fish_rarefish.redeemShark(userId);
				await economy.addCoins(guildId, userId, 1250);
				return 'Du hast für deinen' + fish_rarefish.collection.shark + price.rare + '💵 bekommen!';
			case 'crocodile':
				if (rare.crocodile === false) return 'Du besitzt diesen seltenen Fisch nicht!';
				await fish_rarefish.redeemCrocodile(userId);
				await economy.addCoins(guildId, userId, 1250);
				return 'Du hast für deinen' + fish_rarefish.collection.crocodile + price.rare + '💵 bekommen!';
			default:
				return 'Richtige Types wären: 🐧🐢🐙🦑🦐🦀🐡🐬🐳🐋🦈 oder 🐊';
			}
		}
		else if (args.options === 'sell') {
			if (!args.type) return 'Du musst einen Typ von Fischen definieren, den du verkaufen möchtest!';

			const common = await fish_inv.getCommon(userId);
			const uncommon = await fish_inv.getUncommon(userId);
			const garbage = await fish_inv.getGarbage(userId);

			if (args.type === 'common') {
				await fish_inv.addCommon(userId, common * -1);
				await economy.addCoins(guildId, userId, price.common * common);
				return `:fishing_pole_and_fish:  **|**  Du hast **${common}** gewöhnliche Fische für **${price.common * common}** 💵 verkauft.`;
			}
			if (args.type === 'uncommon') {
				await fish_inv.addUncommon(userId, uncommon * -1);
				await economy.addCoins(guildId, userId, price - uncommon * uncommon);
				return `:fishing_pole_and_fish:  **|**  Du hast **${uncommon}** ungewöhnliche Fische für **${price.uncommon * uncommon}** 💵 verkauft.`;
			}
			if (args.type === 'garbage') {
				await fish_inv.addGarbage(userId, garbage * -1);
				await economy.addCoins(guildId, userId, price.garbage * garbage);
				return `:fishing_pole_and_fish:  **|**  Du hast **${garbage}** Müll für **${price.garbage * garbage}** 💵 verkauft.`;
			}
			if (args.type === 'all') {
				await fish_inv.addCommon(userId, common * -1);
				await fish_inv.addUncommon(userId, uncommon * -1);
				await fish_inv.addGarbage(userId, garbage * -1);
				const credits = price.common * common + price.uncommon * uncommon + price.garbage * garbage;
				await economy.addCoins(guildId, userId, credits);
				return `:fishing_pole_and_fish:  **|**  Du hast **${common}** gewöhnliche Fische, **${uncommon}** ungewöhnliche Fische und **${garbage}** Müll für **${credits}** 💵 verkauft.`;
			}
			return 'Gültige Types wären: `common` `uncommon` `garbage` `all`';
		}
		else if (args.options === 'stats') {
			const common = await fish_stats.getCommon(userId);
			const uncommon = await fish_stats.getUncommon(userId);
			const rare = await fish_stats.getRare(userId);
			const garbage = await fish_stats.getGarbage(userId);

			return `:fishing_pole_and_fish:  **|**  ${user.username}'s Angelstatistik:\n🐟 **Gewöhnliche Fische** | ${common}\n🐠 **Ungewöhnliche Fische** | ${uncommon}\n🦑 **Seltene Fische** | ${rare}\n🗑️ **Müll** | ${garbage}`;
		}
		const coinsOwned = await economy.getCoins(guildId, userId);
		if (coinsOwned < price.perCast) return no + ' | Du hast nicht genügend Credits!';

		if (!cooldowns.has('fish')) cooldowns.set('fish', new Collection());
		const now = Date.now();
		const timestamps = cooldowns.get('fish');
		const cooldownAmount = 30 * 1000;
		if (timestamps.has(userId)) {
			const expirationTime = timestamps.get(userId) + cooldownAmount;
			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return `:fishing_pole_and_fish:  **|  du kannst in ${timeLeft.toFixed(0)} Sekunden wieder fischen.**`;
			}
		}
		timestamps.set(userId, now);
		setTimeout(() => timestamps.delete(userId), cooldownAmount);

		const d = Math.random();

		const mess1 = `:fishing_pole_and_fish:  **|**  **${user.username}**, du hast `;
		const mess2 = ' gefangen! Du hast **10** 💵 bezahlt.';

		if (d < 0.45 & d > 0.1015) {
			await fish_stats.addCommon(userId, 1);
			await fish_inv.addCommon(userId, 1);
			return mess1 + '🐟' + mess2;
		}
		else if (d < 0.1015 & d > 0.0015) {
			await fish_stats.addUncommon(userId, 1);
			await fish_inv.addUncommon(userId, 1);
			return mess1 + '🐠' + mess2;
		}
		else if (d < 0.0015 & d > 0.1015) {
			const rare1 = [
				'🐧', '🐢', '🐙', '🦑', '🦐', '🦀', '🐡', '🐬', '🐳', '🐋', '🦈', '🐊'];
			const randomMessage = rare1[Math.floor(Math.random() * rare1.length)];
			await fish_stats.addRare(userId, 1);
			await fish_inv.addRare(userId, 1);
			return mess1 + randomMessage + mess2;
		}
		else if (d < 1 & d > 0.45) {
			const garbage1 = [
				'🛒', '🔋', '🔧', '👞' ];
			const randomMessage = garbage1[Math.floor(Math.random() * garbage1.length)];
			await fish_stats.addGarbage(userId, 1);
			await fish_inv.addGarbage(userId, 1);
			return mess1 + randomMessage + mess2;
		}
		await economy.addCoins(
			guildId,
			userId,
			price.perCast * -1,
		);
	},
};