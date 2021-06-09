const { MessageEmbed } = require("discord.js");
const { send, edit } = require('../../features/slash');

const { bags, rods } = require('../games/fish.json');
const { rod_1, rod_2, rod_3, rod_4 } = rods;
const { bag_1, bag_2, bag_3, bag_4 } = bags;
const { setRod, setBag } = require('../../features/fishing');
const { yes, no } = require('../../emoji.json');
const  { getInfo, setCompany, buyBusiness, getBusiness, buyUpgrade1, buyUpgrade2, buyUpgrade3 } = require('../../features/business');
const profile = require('../../models/profile');
const { getCoins } = require("../../features/economy");

const documents = getInfo(1);
const weed = getInfo(2);
const fakeMoney = getInfo(3);
const meth = getInfo(4);
const cocaine = getInfo(5);

function format(number) {
	const result = Intl.NumberFormat('de-DE', { maximumSignificantDigits: 10 }).format(number);
	return result;
};

module.exports = {
    description: 'Öffnet das Shop-Menü',
    callback: async ({ client, interaction }) => {
        const guildId = interaction.guild_id;
        const user = interaction.member.user;
        const userId = user.id;

        const credits = await getCoins(guildId, userId);
        const p_save = await profile.findOne({ userId });
		const userBusiness = await getBusiness(guildId, userId);
        const setcompany = await setCompany(guildId, userId)

        const button1 = {
            type: 2,
            label: '1',
            style: 1,
            custon_id: '1',
        };
        
        const button2 = {
            type: 2,
            label: '2',
            style: 1,
            custon_id: '2',
        };

        const button3 = {
            type: 2,
            label: '3',
            style: 1,
            custon_id: '3',
        };

        const button4 = {
            type: 2,
            label: '4',
            style: 1,
            custon_id: '4',
        };

        const button5 = {
            type: 2,
            label: '5',
            style: 1,
            custon_id: '5',
        };

        const row = {
            type: 1,
            row: [ button1, button2, button3, button4 ],
        };

        const embed = new MessageEmbed()
            .setTitle('Azuma Shop')
            .setDescription(`
Wähle eine Kategorie, in der du etwas kaufen möchtest!

:one: Unternehmen kaufen

:two: Unternehmen upgraden

:three: Rucksäcke

:four: Angeln`)
            .setColor('#f77600');

        send(embed, row);

        const response = await client.api.webhooks(client.user.id, interaction.token).messages('@original').get();
        let activePage;

        client.on('clickButton', async button => {
            button.defer();

            if (response.id !== button.message.id) return;

            if (button.id == '1') {
                const buyEmbed = new MessageEmbed()
                    .setTitle('Verfügbare Immobilien')
                    .setDescription('**Deine Credits:** ' + Intl.NumberFormat('de-DE', { maximumSignificantDigits: 10 }).format(credits) + ' 💵')
                    .addFields(
                        { name: `:one: ${documents.name}`, value: `Kosten: \`${format(documents.price)}\` 💵\nUmsatz ohne Upgrades:  \`${format(documents.profit)}\` 💵` },
                        { name: `:two: ${weed.name}`, value: `Kosten: \`${format(weed.price)}\` 💵\nUmsatz ohne Upgrades:  \`${format(weed.profit)}\` 💵` },
                        { name: `:three: ${fakeMoney.name}`, value: `Kosten: \`${format(fakeMoney.price)}\` 💵\nUmsatz ohne Upgrades:  \`${format(fakeMoney.profit)}\` 💵` },
                        { name: `:four: ${meth.name}`, value: `Kosten: \`${format(meth.price)}\` 💵\nUmsatz ohne Upgrades:  \`${format(meth.profit)}\` 💵` },
                        { name: `:five: ${cocaine.name}`, value: `Kosten: \`${format(cocaine.price)}\` 💵\nUmsatz ohne Upgrades:  \`${format(cocaine.profit)}\` 💵` },
                    )
                    .setFooter('Reagiere innerhalb von 60 Sekunden um ein Unternehmen zu kaufen!')
                    .setColor('#2f3136');
                edit(buyEmbed);
                activePage = 'buyBusiness';
            }
            else if (button.id == '2') {
                const upgradeEmbed = new MessageEmbed()
                    .setTitle('Verfügbare Upgrades')
                    .setDescription('**Deine Credits:** ' + Intl.NumberFormat('de-DE', { maximumSignificantDigits: 10 }).format(credits) + ' 💵')
                    .addFields(
                        { name: ':one: Personalupgrade', value: `Stelle mehr Personal ein, um mehr zu produzieren!\nKosten:  \`${format(setcompany.priceUpgrade1)}\` 💵` },
                        { name: ':two: Besserer Zulieferer', value: `Kaufe deine Rohware bei einem zuverlässigerem Zulieferer ein!\nKosten:  \`${format(setcompany.priceUpgrade2)}\` 💵` },
                        { name: `:three: ${setcompany.nameUpgrade3}`, value: `Kaufe für eine bessere Produktion ${setcompany.textUpgrade3}!\nKosten:  \`${format(setcompany.priceUpgrade3)}\` 💵` },
                    )
                    .setFooter('Reagiere innerhalb von 60 Sekunden um ein Unternehmen zu verbessern.')
                    .setColor('#2f3136');
                edit(upgradeEmbed);
                activePage = 'upgradeBusiness';
            }
            else if (button.id == '3') {
                const bagEmbed = new MessageEmbed()
                    .setTitle('🎣 |  Rucksack kaufen')
                    .setDescription('Kaufe einen Rucksack, um mehr Fische auf einmal tragen zu können.\n**Deine Credits:** ' + Intl.NumberFormat('de-DE', { maximumSignificantDigits: 10 }).format(credits) + ' 💵')
                    .addFields(
                        { name: '1️⃣ ' + bag_1.name , value: `Größe: ${bag_1.size}\nKosten: \`${bag_1.price}\` 💵` },
                        { name: '2️⃣ ' + bag_2.name, value: `Größe: ${bag_2.size}\nKosten: \`${bag_2.price}\` 💵` },
                        { name: '3️⃣ ' + bag_3.name, value: `Größe: ${bag_3.size}\nKosten: \`${bag_3.price}\` 💵` },
                        { name: '4️⃣ ' + bag_4.name, value: `Größe: ${bag_4.size}\nKosten: \`${bag_4.price}\` 💵` }
                    )
                    .setColor('#f77600');
                edit(bagEmbed);
                activePage = '3';
            }
            else if (button.id == '4') {
                const rodEmbed = new MessageEmbed()
                    .setTitle('🎣  |  Angeln kaufen')
                    .setDescription('Kaufe eine Angel, um Fische mit `/fish` zu fangen. Eine Angel geht nach einer Zeit kaputt.\n**Deine Credits:** ' + Intl.NumberFormat('de-DE', { maximumSignificantDigits: 10 }).format(credits) + ' 💵')
                    .addFields(
                        { name: '1️⃣ ' + rod_1.name, value: `Chance kein Köder zu verbrauchen: ${rod_1.no_bait * 100}%\nAngel-Cooldown: ${rod_1.cooldown} Sekunden\nKosten: \`${rod_1.price}\` 💵` },
                        { name: '2️⃣ ' + rod_2.name, value: `Chance kein Köder zu verbrauchen: ${rod_2.no_bait * 100}%\nAngel-Cooldown: ${rod_2.cooldown} Sekunden\nKosten: \`${rod_2.price}\` 💵` },
                        { name: '3️⃣ ' + rod_3.name, value: `Chance kein Köder zu verbrauchen: ${rod_3.no_bait * 100}%\nAngel-Cooldown: ${rod_3.cooldown} Sekunden\nKosten: \`${rod_3.price}\` 💵` },
                        { name: '4️⃣ ' + rod_4.name, value: `Chance kein Köder zu verbrauchen: ${rod_4.no_bait * 100}%\nAngel-Cooldown: ${rod_4.cooldown} Sekunden\nKosten: \`${rod_4.price}\` 💵` }
                    )
                    .setColor('#f77600');
                edit(rodEmbed);
                activePage = '4';
            };
        });
    },
};