const { MessageEmbed } = require("discord.js");

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
	options: [
		{
			name: 'type',
			description: 'Wähle das Unternehmen das du kaufen möchtest!',
			type: 3,
			choices: [
                {
                    name: 'Dokumentenfälscherei',
                    value: 'documents',
                },
                {
                    name: 'Hanfplantage',
                    value: 'weed',
                },
                {
                    name: 'Geldfälscherei',
                    value: 'fakemoney',
                },
                {
                    name: 'Methlabor',
                    value: 'meth',
                },
                {
                    name: 'Kokainlabor',
                    value: 'cocaine',
                },
            ]
		}
	],
    callback: async ({ args, interaction }) => {
        const guildId = interaction.guild_id;
        const userId = interaction.member.user.id;

        const targetCoins = await economy.getCoins(guildId, userId);
		const getBusiness = await business.getBusiness(guildId, userId);

        if (!args.type) {
            const embed = new MessageEmbed()
            .setTitle('Verfügbare Immobilien')
            .addFields(
                { name: `:one: ${documents.name}`, value: `Kosten: \`${format(documents.price)}\` 💵\nUmsatz ohne Upgrades:  \`${format(documents.profit)}\` 💵` },
                { name: `:two: ${weed.name}`, value: `Kosten: \`${format(weed.price)}\` 💵\nUmsatz ohne Upgrades:  \`${format(weed.profit)}\` 💵` },
                { name: `:three: ${fakeMoney.name}`, value: `Kosten: \`${format(fakeMoney.price)}\` 💵\nUmsatz ohne Upgrades:  \`${format(fakeMoney.profit)}\` 💵` },
                { name: `:four: ${meth.name}`, value: `Kosten: \`${format(meth.price)}\` 💵\nUmsatz ohne Upgrades:  \`${format(meth.profit)}\` 💵` },
                { name: `:five: ${cocaine.name}`, value: `Kosten: \`${format(cocaine.price)}\` 💵\nUmsatz ohne Upgrades:  \`${format(cocaine.profit)}\` 💵` },
            )
            .setFooter('Benutze /buy [business] um ein Unternehmen zu kaufen!')
            .setColor('#2f3136');
            return embed;
        }
        let company = [];
        if (args.type == 'documents') {
            company = documents;
        }
        else if (args.type == 'weed') {
            company = weed;
        }
        else if (args.type == 'fakemoney') {
            company = fakeMoney;
        }
        else if (args.type == 'meth') {
            company = meth;
        }
        else if (args.type == 'cocaine') {
            company = cocaine;
        }
        if (targetCoins < company.price) return '<:no:767394810909949983> | Du hast nicht genug Credits um dir dieses Unternehmen leisten zu können!';
        if (getBusiness !== null) {
            if (getBusiness.type === company.name) return '<:no:767394810909949983> | Du besitzt bereits dieses Unternehmen!';
        }

        await business.buyBusiness(guildId, userId, company.name);
        await economy.addCoins(guildId, userId, company.price * -1);
        return `Du hast eine ${company.name} gekauft! Du hast \`${format(company.price)} \` 💵 bezahlt.`;
    }
}