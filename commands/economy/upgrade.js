const { MessageEmbed } = require('discord.js');

const economy = require('../../features/economy');
const business = require('../../features/business');

function format(number) {
	const result = Intl.NumberFormat('de-DE', { maximumSignificantDigits: 3 }).format(number);
	return result;
}

module.exports = {
    slash: true,
    callback: async ({ args, interaction }) => {
        const guildId = interaction.guild_id;
        const userId = interaction.member.user.id;

        const targetCoins = await economy.getCoins(guildId, userId);
		const getBusiness = await business.getBusiness(guildId, userId);

    	if (getBusiness === null) return channel.send('<:no:767394810909949983> | Du brauchst ein Unternehmen um Upgrades zu kaufen!');

    	const company = await business.setCompany(guildId, userId);

        if (!args.type) {
            const embed = new MessageEmbed()
				.setTitle('Verfügbare Upgrades')
				.addFields(
					{ name: ':one: Personalupgrade', value: `Stelle mehr Personal ein, um mehr zu produzieren!\nKosten:  \`${format(company.priceUpgrade1)}\` 💵` },
					{ name: ':two: Besserer Zulieferer', value: `Kaufe deine Rohware bei einem zuverlässigerem Zulieferer ein!\nKosten:  \`${format(company.priceUpgrade2)}\` 💵` },
					{ name: `:three: ${company.nameUpgrade3}`, value: `Kaufe für eine bessere Produktion ${company.textUpgrade3}!\nKosten:  \`${format(company.priceUpgrade3)}\` 💵` },
				)
				.setFooter('Benutze /upgrade [business] um ein Unternehmen zu kaufen.')
				.setColor('#2f3136');
            return embed;
        }
        if (args.type === 'upgrade_1') {
            if (getBusiness.upgrade1 === true) return 'Du hast bereits mehr Personal eingestellt!';
            if (targetCoins < company.priceUpgrade1) return `Du hast doch gar nicht ${format(company.priceUpgrade1)} 💵 <:Susge:809947745342980106>`;
            await business.buyUpgrade1(guildId, userId, getBusiness.type);
            await economy.addCoins(guildId, userId, company.priceUpgrade1 * -1);
            return `Du hast für dein Unternehmen das Personalupgrade gekauft! Du hast \`${format(company.priceUpgrade1)}\` 💵 bezahlt.`;
        }
        else if (args.type === 'upgrade_2') {
            if (getBusiness.upgrade2 === true) return 'Du kaufst bereits bei einem besseren Zulieferer!';
            if (targetCoins < company.priceUpgrade2) return `Du hast doch gar nicht ${format(company.priceUpgrade2)} 💵 <:Susge:809947745342980106>`;
            await business.buyUpgrade2(guildId, userId, getBusiness.type);
            await economy.addCoins(guildId, userId, company.priceUpgrade2 * -1);
            return `Du kauft nun deine Rohware bei einem besseren Zulieferer ein! Du hast \`${format(company.priceUpgrade2)}\` 💵 bezahlt.`; 
        }
        else if (args.type === 'upgrade_3') {
            if (getBusiness.upgrade3 === true) return `Du hast bereits ${company.textUpgrade3}!`;
            if (targetCoins < company.priceUpgrade3) return `Du hast doch gar nicht ${format(company.priceUpgrade3)} 💵 <:Susge:809947745342980106>`;
            await business.buyUpgrade3(guildId, userId, getBusiness.type);
            await economy.addCoins(guildId, userId, company.priceUpgrade3 * -1);
            return `Du hast ${company.textUpgrade3} gekauft! Du hast \`${format(company.priceUpgrade3)}\` 💵 bezahlt.`;
        }
    }
}