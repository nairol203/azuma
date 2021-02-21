const economy = require('../../../features/economy');
const business = require('../../../features/business');

const documents = business.getInfo(1);
const weed = business.getInfo(2);
const fakeMoney = business.getInfo(3);
const meth = business.getInfo(4);
const cocaine = business.getInfo(5);

module.exports = {
	callback: async ({ message, args }) => {
		const { author, guild, channel } = message;
		const guildId = guild.id;
		const userId = author.id;

		const targetCoins = await economy.getCoins(guildId, userId);
		const getBusiness = await business.getBusiness(guildId, userId);

		if (args[0] === 'buy') {
			const filter = m => m.author.id === message.author.id;
			channel.send(`
Diese Unternehmen kannst du kaufen:

1) Dokumentenfälscherei - ${documents.price} Coins
2) Hanfplantage - ${weed.price} Coins
3) Geldfälscherei - ${fakeMoney.price} Coins
4) Methproduktion - ${meth.price} Coins
5. Kokainproduktion - ${cocaine.price} Coins

Bitte schreibe die jeweilige Zahl für das Unternehmen das du kaufen willst oder \`cancel\` zum abbrechen.`).then(() =>{
				channel.awaitMessages(filter, {
					max: 1,
					time: 30000,
					errors: ['time'],
				})
					.then(async message => {
						message = message.first();
						let company = [];

						if (message.content === '1') company = documents;
						if (message.content === '2') company = weed;
						if (message.content === '3') company = fakeMoney;
						if (message.content === '4') company = meth;
						if (message.content === '5') company = cocaine;
						if (message.content === 'cancel') return channel.send('Du hast den Kauf eines Unternehmens abgebrochen!');

						if (company !== []) {
							if (targetCoins < company.price) return channel.send(`Du hast doch gar nicht ${company.price} Coins <:Susge:809947745342980106>`);
							if (getBusiness !== null) {
								if (getBusiness.type === company.name) return channel.send('Du besitzt bereits dieses Unternehmen!');
							}
							await business.buyBusiness(guildId, userId, company.name);
							await economy.addCoins(guildId, userId, company.price * -1);
							return channel.send(`Du hast eine ${company.name} gekauft!`);
						}
						else {
							return channel.send('Ich habe keine gültige Eingabe erkannt!');
						}

					})
					.catch(collected => {
						return channel.send('Ich habe keine gültige Eingabe erkannt!');
					});
			});
		}
		else if (args[0] === 'upgrade') {
			if (getBusiness === null) return channel.send('Du brauchst ein Unternehmen um Upgrades zu kaufen!');
			let company = [];
			if (getBusiness.type === 'Dokumentenfälscherei') company = documents;
			if (getBusiness.type === 'Handplantage') company = weed;
			if (getBusiness.type === 'Geldfälscherei') company = fakeMoney;
			if (getBusiness.type === 'Methproduktion') company = meth;
			if (getBusiness.type === 'Kokainproduktion') company = cocaine;

			const filter = m => m.author.id === message.author.id;
			channel.send(`
Das sind die verfügbaren Upgrades für dein Unternehmen!

1) Personalupgrade - \`${company.priceUpgrade1} Coins\`
Stelle mehr Personal ein, um mehr zu produzieren!

2) Bessere Zulieferer -  \`${company.priceUpgrade2} Coins\`
Kaufe deine Rohware bei einem zuverlässigererem Zulieferer ein!

3) ${company.nameUpgrade3} - \`${company.priceUpgrade3} Coins\`
Kaufe für eine bessere Produktion ${company.textUpgrade3}!

Bitte schreibe die jeweilige Zahl für das Upgrade das du kaufen willst oder \`cancel\` zum abbrechen.`).then(() => {
				channel.awaitMessages(filter, {
					max: 1,
					time: 30000,
					errors: ['time'],
				})
					.then(async message => {
						message = message.first();
						if (message.content === '1') {
							if (getBusiness.upgrade1 === true) return channel.send('Du hast bereits mehr Personal eingestellt!');
							if (targetCoins < company.priceUpgrade1) return channel.send(`Du hast doch gar nicht ${company.priceUpgrade1} Coins <:Susge:809947745342980106>`);
							await business.buyUpgrade1(guildId, userId, getBusiness.type);
							await economy.addCoins(guildId, userId, company.priceUpgrade1 * -1);
							channel.send(`Du hast für dein Unternehmen das Personalupgrade gekauft! \`-${company.priceUpgrade1} Coins\``);
						}
						else if (message.content === '2') {
							if (getBusiness.upgrade2 === true) return channel.send('Du kaufst bereits bei einem besseren Zulieferer!');
							if (targetCoins < company.priceUpgrade2) return channel.send(`Du hast doch gar nicht ${company.priceUpgrade2} Coins <:Susge:809947745342980106>`);
							await business.buyUpgrade2(guildId, userId, getBusiness.type);
							await economy.addCoins(guildId, userId, company.priceUpgrade2 * -1);
							channel.send(`Du kauft nun deine Rohware bei einem besseren Zulieferer ein! \`-${company.priceUpgrade1} Coins\``);
						}
						else if (message.content === '3') {
							if (getBusiness.upgrade3 === true) return channel.send(`Du hast bereits ${company.textUpgrade3}!`);
							if (targetCoins < company.priceUpgrade3) return channel.send(`Du hast doch gar nicht ${company.priceUpgrade3} Coins <:Susge:809947745342980106>`);
							await business.buyUpgrade3(guildId, userId, getBusiness.type);
							await economy.addCoins(guildId, userId, company.priceUpgrade3 * -1);
							channel.send(`Du hast ${company.textUpgrade3} gekauft! \`-${company.priceUpgrade1} Coins\``);
						}
						else if (message.content === 'cancel') {
							return channel.send('Du hast den Kauf von einem Upgrade abgebrochen!');
						}
						else {
							return channel.send('Ich habe keine gültige Eingabe erkannt!');
						}
					})
					.catch(collected => {
						return channel.send('Ich habe keine gültige Eingabe erkannt!');
					});
			});
		}
		else {
			if (getBusiness === null) return channel.send('Du hast kein Unternehmen, kaufe eins mit `!business buy`!');
			let company = [];
			if (getBusiness.type === 'Dokumentenfälscherei') company = documents;
			if (getBusiness.type === 'Handplantage') company = weed;
			if (getBusiness.type === 'Geldfälscherei') company = fakeMoney;
			if (getBusiness.type === 'Methproduktion') company = meth;
			if (getBusiness.type === 'Kokainproduktion') company = cocaine;
			channel.send(`
**${author.username}'s ${getBusiness.type}:**

Akuteller Umsatz:
*coming soon*

Zeit bis das Lager voll ist:
*coming soon*

Upgrades:
- Personalupgrade: ${getBusiness.upgrade1}
- Besserer Zulieferer: ${getBusiness.upgrade2}
- ${company.nameUpgrade3}: ${getBusiness.upgrade3}
`);
		}
	},
};