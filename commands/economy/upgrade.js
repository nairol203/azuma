const { MessageEmbed } = require('discord.js');
const { no } = require('../../emoji.json');

const economy = require('../../features/economy');
const business = require('../../features/business');

function format(number) {
	const result = Intl.NumberFormat('de-DE', { maximumSignificantDigits: 3 }).format(number);
	return result;
}

module.exports = {
	slash: true,
	description: 'Verbessere dein Unternehmen!',
	callback: async ({ client, interaction }) => {
		const guildId = interaction.guild_id;
		const userId = interaction.member.user.id;
		const channel = client.channels.cache.get(interaction.channel_id);

		const targetCoins = await economy.getCoins(guildId, userId);
		const getBusiness = await business.getBusiness(guildId, userId);

		if (getBusiness === null) return channel.send(no + ' | Du brauchst ein Unternehmen um Upgrades zu kaufen!');

		const company = await business.setCompany(guildId, userId);

		const embed = new MessageEmbed()
			.setTitle('Verfügbare Upgrades')
			.addFields(
				{ name: ':one: Personalupgrade', value: `Stelle mehr Personal ein, um mehr zu produzieren!\nKosten:  \`${format(company.priceUpgrade1)}\` 💵` },
				{ name: ':two: Besserer Zulieferer', value: `Kaufe deine Rohware bei einem zuverlässigerem Zulieferer ein!\nKosten:  \`${format(company.priceUpgrade2)}\` 💵` },
				{ name: `:three: ${company.nameUpgrade3}`, value: `Kaufe für eine bessere Produktion ${company.textUpgrade3}!\nKosten:  \`${format(company.priceUpgrade3)}\` 💵` },
			)
			.setFooter('Reagiere innerhalb von 60 Sekunden um ein Unternehmen zu verbessern.')
			.setColor('#2f3136');
		setTimeout(() => {
			channel.send(embed).then(async (msg) => {
				msg.react('1️⃣').then(msg.react('2️⃣').then(msg.react('3️⃣')));
				msg.awaitReactions((reaction, user) => user.id == userId && ((reaction.emoji.name == '1️⃣') || (reaction.emoji.name == '2️⃣') || (reaction.emoji.name == '3️⃣')), {
					max: 1,
					time: 1000 * 60,
				}).then(async collected => {
					switch (collected.first().emoji.name) {
					case '1️⃣':
						if (getBusiness.upgrade1 === true) return channel.send('Du hast bereits mehr Personal eingestellt!');
						if (targetCoins < company.priceUpgrade1) return channel.send(`Du hast doch gar nicht ${format(company.priceUpgrade1)} 💵 <:Susge:809947745342980106>`);
						await business.buyUpgrade1(guildId, userId, getBusiness.type);
						await economy.addCoins(guildId, userId, company.priceUpgrade1 * -1);
						channel.send(`Du hast für dein Unternehmen das Personalupgrade gekauft! Du hast \`${format(company.priceUpgrade1)}\` 💵 bezahlt.`);
						break;
					case '2️⃣':
						if (getBusiness.upgrade2 === true) return channel.send('Du kaufst bereits bei einem besseren Zulieferer!');
						if (targetCoins < company.priceUpgrade2) return channel.send(`Du hast doch gar nicht ${format(company.priceUpgrade2)} 💵 <:Susge:809947745342980106>`);
						await business.buyUpgrade2(guildId, userId, getBusiness.type);
						await economy.addCoins(guildId, userId, company.priceUpgrade2 * -1);
						channel.send(`Du kauft nun deine Rohware bei einem besseren Zulieferer ein! Du hast \`${format(company.priceUpgrade2)}\` 💵 bezahlt.`);
						break;
					case '3️⃣':
						if (getBusiness.upgrade3 === true) return channel.send(`Du hast bereits ${company.textUpgrade3}!`);
						if (targetCoins < company.priceUpgrade3) return channel.send(`Du hast doch gar nicht ${format(company.priceUpgrade3)} 💵 <:Susge:809947745342980106>`);
						await business.buyUpgrade3(guildId, userId, getBusiness.type);
						await economy.addCoins(guildId, userId, company.priceUpgrade3 * -1);
						channel.send(`Du hast ${company.textUpgrade3} gekauft! Du hast \`${format(company.priceUpgrade3)}\` 💵 bezahlt.`);
						break;
					}
				}).catch(() => {
					return msg.edit(no + 'Du hast nicht innerhalb von 60 Sekunden reagiert!');
				});
			});
		}, 300);
	},
};