const { MessageEmbed } = require('discord.js');
const { no } = require('../../emoji.json');

const economy = require('../../features/economy');
const business = require('../../features/business');

const documents = business.getInfo(1);
const weed = business.getInfo(2);
const fakeMoney = business.getInfo(3);
const meth = business.getInfo(4);
const cocaine = business.getInfo(5);

function format(number) {
	const result = Intl.NumberFormat('de-DE', { maximumSignificantDigits: 3 }).format(number);
	return result;
}

module.exports = {
	slash: true,
	description: 'Kaufe ein Unternehmen!',
	callback: async ({ client, interaction }) => {
		const guildId = interaction.guild_id;
		const userId = interaction.member.user.id;
		const channel = client.channels.cache.get(interaction.channel_id);

		const targetCoins = await economy.getCoins(guildId, userId);
		const getBusiness = await business.getBusiness(guildId, userId);

		const embed = new MessageEmbed()
			.setTitle('Verfügbare Immobilien')
			.addFields(
				{ name: `:one: ${documents.name}`, value: `Kosten: \`${format(documents.price)}\` 💵\nUmsatz ohne Upgrades:  \`${format(documents.profit)}\` 💵` },
				{ name: `:two: ${weed.name}`, value: `Kosten: \`${format(weed.price)}\` 💵\nUmsatz ohne Upgrades:  \`${format(weed.profit)}\` 💵` },
				{ name: `:three: ${fakeMoney.name}`, value: `Kosten: \`${format(fakeMoney.price)}\` 💵\nUmsatz ohne Upgrades:  \`${format(fakeMoney.profit)}\` 💵` },
				{ name: `:four: ${meth.name}`, value: `Kosten: \`${format(meth.price)}\` 💵\nUmsatz ohne Upgrades:  \`${format(meth.profit)}\` 💵` },
				{ name: `:five: ${cocaine.name}`, value: `Kosten: \`${format(cocaine.price)}\` 💵\nUmsatz ohne Upgrades:  \`${format(cocaine.profit)}\` 💵` },
			)
			.setFooter('Reagiere innerhalb von 60 Sekunden um ein Unternehmen zu kaufen!')
			.setColor('#2f3136');
		setTimeout(() => {
			channel.send(embed).then(async (msg) => {
				msg.react('1️⃣').then(msg.react('2️⃣').then(msg.react('3️⃣').then(msg.react('4️⃣').then(msg.react('5️⃣')))));
				msg.awaitReactions((reaction, user) => user.id == userId && (reaction.emoji.name == '1️⃣') || (reaction.emoji.name == '2️⃣') || (reaction.emoji.name == '3️⃣') || (reaction.emoji.name == '4️⃣') || (reaction.emoji.name == '5️⃣'), {
					max: 1,
					time: 60 * 1000,
				}).then(async collected => {
					let company = [];
					switch (collected.first().emoji.name) {
					case '1️⃣':
						company = documents;
					case '2️⃣':
						company = weed;
					case '3️⃣':
						company = fakeMoney;
					case '4️⃣':
						company = meth;
					case '5️⃣':
						company = cocaine;
					}
					if (targetCoins < company.price) return no + ' | Du hast nicht genug Credits um dir dieses Unternehmen leisten zu können!';
					if (getBusiness !== null) {
						if (getBusiness.type === company.name) return no + ' | Du besitzt bereits dieses Unternehmen!';
					}
					await business.buyBusiness(guildId, userId, company.name);
					await economy.addCoins(guildId, userId, company.price * -1);
					return `Du hast eine ${company.name} gekauft! Du hast \`${format(company.price)} \` 💵 bezahlt.`;
				}).catch(() => {
					return;
				});
			});
		}, 300);
	},
};