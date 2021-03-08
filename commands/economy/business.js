const economy = require('../../features/economy');
const business = require('../../features/business');
const cooldowns = require('../../features/cooldowns');
const { MessageEmbed } = require('discord.js');

const documents = business.getInfo(1);
const weed = business.getInfo(2);
const fakeMoney = business.getInfo(3);
const meth = business.getInfo(4);
const cocaine = business.getInfo(5);

function format(number) {
	const result = Intl.NumberFormat('de-DE', { maximumSignificantDigits: 3 }).format(number);
	return result;
}

function showBar(cd) {
	const progress = (28800 % cd) / 28800;
	const progressOutOf18 = Math.round(progress * 18);

	const barStr = `${'█'.repeat(progressOutOf18)}${'░'.repeat(18 - progressOutOf18)}`;
	return barStr;
}

module.exports = {
	slash: true,
	minArgs: 0,
	maxArgs: 1,
	expectedArgs: '[buy] | [upgrade]',
	description: 'Verwalte dein eigenes Business und verdiene Credits!',
	callback: async ({ args, interaction }) => {
		const guildId = interaction.guild_id
		const member = interaction.member;
		const userId = member.user.id

		const targetCoins = await economy.getCoins(guildId, userId);
		const getBusiness = await business.getBusiness(guildId, userId);

		if (args.type === 'buy') {
			return 'Dieser Befehl befindet sich aktuell in Wartungsarbeiten, versuche es später noch einmal.';
		}
		if (args.type === 'upgrade') {
			return 'Dieser Befehl befindet sich aktuell in Wartungsarbeiten, versuche es später noch einmal.';
		}
		if (getBusiness === null) return '<:no:767394810909949983> | Du hast kein Unternehmen, kaufe eins mit `!business buy`!';

		const company = await business.setCompany(guildId, userId);
		const profit = await business.checkProfit(guildId, userId);

		const up1 = getBusiness.upgrade1 ? '<:ja:767394811140374568>' : '<:no:767394810909949983>';
		const up2 = getBusiness.upgrade2 ? '<:ja:767394811140374568>' : '<:no:767394810909949983>';
		const up3 = getBusiness.upgrade3 ? '<:ja:767394811140374568>' : '<:no:767394810909949983>';

		const getCooldown = await cooldowns.getCooldown(userId, 'work');

		let cd = '';
		let cooldown = '';
		if (getCooldown === null) {
			cd = '██████████████████\nDein Lager ist voll! Verkaufe die Ware mit `!work`';
		}
		else {
			cooldown = getCooldown;
			cd = showBar(cooldown);
		}
		const embed = new MessageEmbed()
			.setTitle(`${member.user.username}'s ${getBusiness.type}`)
			.addFields(
				{ name: 'Akuteller Umsatz', value: `\`${format(profit)}\` 💵` },
				{ name: 'Lagerbestand', value: cd },
				{ name: 'Upgrades:', value: `${up1} Personalupgrade\n${up2} Besserer Zulieferer\n${up3} ${company.nameUpgrade3}` },
			)
			.setColor('#2f3136');
		return embed;

		// const { author, guild, channel } = message;
		// const guildId = guild.id;
		// const userId = author.id;

		// const targetCoins = await economy.getCoins(guildId, userId);
		// const getBusiness = await business.getBusiness(guildId, userId);

		// if (args[0] === 'buy') {
		// 	const filter = m => m.author.id === message.author.id;

		// 	const embed = new Discord.MessageEmbed()
		// 		.setTitle('Verfügbare Immobilien')
		// 		.addFields(
		// 			{ name: `:one: ${documents.name}`, value: `Kosten: \`${format(documents.price)}\` 💵\nUmsatz ohne Upgrades:  \`${format(documents.profit)}\` 💵` },
		// 			{ name: `:two: ${weed.name}`, value: `Kosten: \`${format(weed.price)}\` 💵\nUmsatz ohne Upgrades:  \`${format(weed.profit)}\` 💵` },
		// 			{ name: `:three: ${fakeMoney.name}`, value: `Kosten: \`${format(fakeMoney.price)}\` 💵\nUmsatz ohne Upgrades:  \`${format(fakeMoney.profit)}\` 💵` },
		// 			{ name: `:four: ${meth.name}`, value: `Kosten: \`${format(meth.price)}\` 💵\nUmsatz ohne Upgrades:  \`${format(meth.profit)}\` 💵` },
		// 			{ name: `:five: ${cocaine.name}`, value: `Kosten: \`${format(cocaine.price)}\` 💵\nUmsatz ohne Upgrades:  \`${format(cocaine.profit)}\` 💵` },
		// 		)
		// 		.setFooter('Bitte schreibe die jeweilige Zahl für das Upgrade das du kaufen willst oder cancel zum abbrechen.')
		// 		.setColor('#2f3136');
		// 	channel.send(embed).then(() => {
		// 		channel.awaitMessages(filter, {
		// 			max: 1,
		// 			time: 30000,
		// 			errors: ['time'],
		// 		})
		// 			.then(async message => {
		// 				message = message.first();
		// 				let company = [];

		// 				if (message.content === '1') {
		// 					company = documents;
		// 				}
		// 				else if (message.content === '2') {
		// 					company = weed;
		// 				}
		// 				else if (message.content === '3') {
		// 					company = fakeMoney;
		// 				}
		// 				else if (message.content === '4') {
		// 					company = meth;
		// 				}
		// 				else if (message.content === '5') {
		// 					company = cocaine;
		// 				}
		// 				else if (message.content === 'cancel') {
		// 					return channel.send('<:no:767394810909949983> | Du hast den Kauf eines Unternehmens abgebrochen!');
		// 				}
		// 				else {
		// 					return channel.send('<:no:767394810909949983> | Ich habe keine gültige Eingabe erkannt!');
		// 				}

		// 				if (targetCoins < company.price) return channel.send('<:no:767394810909949983> | Du hast nicht genug Credits um dir dieses Unternehmen leisten zu können!');
		// 				if (getBusiness !== null) {
		// 					if (getBusiness.type === company.name) return channel.send('<:no:767394810909949983> | Du besitzt bereits dieses Unternehmen!');
		// 				}
		// 				await business.buyBusiness(guildId, userId, company.name);
		// 				await economy.addCoins(guildId, userId, company.price * -1);
		// 				return channel.send(`Du hast eine ${company.name} gekauft! Du hast \`${format(company.price)} \` 💵 bezahlt.`);
		// 			})
		// 			.catch(collected => {
		// 				return channel.send('<:no:767394810909949983> | Ich habe keine Eingabe erkannt!');
		// 			});
		// 	});
		// }
		// else if (args[0] === 'upgrade') {
		// 	if (getBusiness === null) return channel.send('<:no:767394810909949983> | Du brauchst ein Unternehmen um Upgrades zu kaufen!');
		// 	const company = await business.setCompany(guildId, userId);

		// 	const filter = m => m.author.id === message.author.id;

		// 	const embed = new Discord.MessageEmbed()
		// 		.setTitle('Verfügbare Upgrades')
		// 		.addFields(
		// 			{ name: ':one: Personalupgrade', value: `Stelle mehr Personal ein, um mehr zu produzieren!\nKosten:  \`${format(company.priceUpgrade1)}\` 💵` },
		// 			{ name: ':two: Besserer Zulieferer', value: `Kaufe deine Rohware bei einem zuverlässigerem Zulieferer ein!\nKosten:  \`${format(company.priceUpgrade2)}\` 💵` },
		// 			{ name: `:three: ${company.nameUpgrade3}`, value: `Kaufe für eine bessere Produktion ${company.textUpgrade3}!\nKosten:  \`${format(company.priceUpgrade3)}\` 💵` },
		// 		)
		// 		.setFooter('Bitte schreibe die jeweilige Zahl für das Upgrade das du kaufen willst oder cancel zum abbrechen.')
		// 		.setColor('#2f3136');
		// 	channel.send(embed).then(() => {
		// 		channel.awaitMessages(filter, {
		// 			max: 1,
		// 			time: 30000,
		// 			errors: ['time'],
		// 		})
		// 			.then(async message => {
		// 				message = message.first();
		// 				if (message.content === '1') {
		// 					if (getBusiness.upgrade1 === true) return channel.send('Du hast bereits mehr Personal eingestellt!');
		// 					if (targetCoins < company.priceUpgrade1) return channel.send(`Du hast doch gar nicht ${format(company.priceUpgrade1)} 💵 <:Susge:809947745342980106>`);
		// 					await business.buyUpgrade1(guildId, userId, getBusiness.type);
		// 					await economy.addCoins(guildId, userId, company.priceUpgrade1 * -1);
		// 					channel.send(`Du hast für dein Unternehmen das Personalupgrade gekauft! Du hast \`${format(company.priceUpgrade1)}\` 💵 bezahlt.`);
		// 				}
		// 				else if (message.content === '2') {
		// 					if (getBusiness.upgrade2 === true) return channel.send('Du kaufst bereits bei einem besseren Zulieferer!');
		// 					if (targetCoins < company.priceUpgrade2) return channel.send(`Du hast doch gar nicht ${format(company.priceUpgrade2)} 💵 <:Susge:809947745342980106>`);
		// 					await business.buyUpgrade2(guildId, userId, getBusiness.type);
		// 					await economy.addCoins(guildId, userId, company.priceUpgrade2 * -1);
		// 					channel.send(`Du kauft nun deine Rohware bei einem besseren Zulieferer ein! Du hast \`${format(company.priceUpgrade2)}\` 💵 bezahlt.`);
		// 				}
		// 				else if (message.content === '3') {
		// 					if (getBusiness.upgrade3 === true) return channel.send(`Du hast bereits ${company.textUpgrade3}!`);
		// 					if (targetCoins < company.priceUpgrade3) return channel.send(`Du hast doch gar nicht ${format(company.priceUpgrade3)} 💵 <:Susge:809947745342980106>`);
		// 					await business.buyUpgrade3(guildId, userId, getBusiness.type);
		// 					await economy.addCoins(guildId, userId, company.priceUpgrade3 * -1);
		// 					channel.send(`Du hast ${company.textUpgrade3} gekauft! Du hast \`${format(company.priceUpgrade3)}\` 💵 bezahlt.`);
		// 				}
		// 				else if (message.content === 'cancel') {
		// 					return channel.send('<:no:767394810909949983> | Du hast den Kauf von einem Upgrade abgebrochen!');
		// 				}
		// 				else {
		// 					return channel.send('<:no:767394810909949983> | Ich habe keine gültige Eingabe erkannt!');
		// 				}
		// 			})
		// 			.catch(collected => {
		// 				return channel.send('<:no:767394810909949983> | Ich habe keine gültige Eingabe erkannt!');
		// 			});
		// 	});
		// }
		// else {
		// 	if (getBusiness === null) return channel.send('<:no:767394810909949983> | Du hast kein Unternehmen, kaufe eins mit `!business buy`!');

		// 	const company = await business.setCompany(guildId, userId);
		// 	const profit = await business.checkProfit(guildId, userId);

		// 	const up1 = getBusiness.upgrade1 ? '<:ja:767394811140374568>' : '<:no:767394810909949983>';
		// 	const up2 = getBusiness.upgrade2 ? '<:ja:767394811140374568>' : '<:no:767394810909949983>';
		// 	const up3 = getBusiness.upgrade3 ? '<:ja:767394811140374568>' : '<:no:767394810909949983>';

		// 	const getCooldown = await cooldowns.getCooldown(userId, 'work');

		// 	let cd = '';
		// 	let cooldown = '';
		// 	if (getCooldown === null) {
		// 		cd = '██████████████████\nDein Lager ist voll! Verkaufe die Ware mit `!work`';
		// 	}
		// 	else {
		// 		cooldown = getCooldown;
		// 		cd = showBar(cooldown);
		// 	}
		// 	const embed = new Discord.MessageEmbed()
		// 		.setTitle(`${author.username}'s ${getBusiness.type}`)
		// 		.addFields(
		// 			{ name: 'Akuteller Umsatz', value: `\`${format(profit)}\` 💵` },
		// 			{ name: 'Lagerbestand', value: cd },
		// 			{ name: 'Upgrades:', value: `${up1} Personalupgrade\n${up2} Besserer Zulieferer\n${up3} ${company.nameUpgrade3}` },
		// 		)
		// 		.setColor('#2f3136');
		// 	channel.send(embed);
		// }
	},
};