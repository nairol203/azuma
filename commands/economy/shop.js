const { MessageEmbed } = require("discord.js");
const { addCoins, getCoins } = require('../../features/economy');
const { bags, rods } = require('../games/fish.json');
const { setRod } = require('../../features/fishing');
const { yes, no } = require('../../emoji.json');
const  { getInfo, setCompany, buyBusiness, getBusiness, buyUpgrade1, buyUpgrade2, buyUpgrade3 } = require('../../features/business');
const profile = require('../../models/profile');

const documents = getInfo(1);
const weed = getInfo(2);
const fakeMoney = getInfo(3);
const meth = getInfo(4);
const cocaine = getInfo(5);

function format(number) {
	const result = Intl.NumberFormat('de-DE', { maximumSignificantDigits: 3 }).format(number);
	return result;
}

const shopEmbed = new MessageEmbed()
    .setTitle('Azuma Shop')
    .setDescription(`
    Wähle eine Kategorie, in der du etwas kaufen möchtest!

    :one: Unternehmen kaufen

    :two: Unternehmen upgraden

    :three: Rucksäcke

    :four: Angeln
    `)
    .setColor('#f77600');

const bagEmbed = new MessageEmbed()
    .setTitle('🎣 |  Rucksack kaufen')
    .setDescription('Kaufe einen Rucksack, um mehr Fische auf einmal tragen zu können.')
    .addFields(
        { name: '1️⃣ ' + bags.bag_1.name , value: `Größe: ${bags.bag_1.size}\nKosten: \`${bags.bag_1.price}\` 💵` },
        { name: '2️⃣ ' + bags.bag_2.name, value: `Größe: ${bags.bag_2.size}\nKosten: \`${bags.bag_2.price}\` 💵` },
        { name: '3️⃣ ' + bags.bag_3.name, value: `Größe: ${bags.bag_3.size}\nKosten: \`${bags.bag_3.price}\` 💵` },
        { name: '4️⃣ ' + bags.bag_4.name, value: `Größe: ${bags.bag_4.size}\nKosten: \`${bags.bag_4.price}\` 💵` }
    )
    .setColor('#f77600');

const rodEmbed = new MessageEmbed()
    .setTitle('🎣  |  Angeln kaufen')
    .setDescription('Kaufe eine Angel, um Fische mit `/fish` zu fangen. Eine Angel geht nach einer Zeit kaputt.')
    .addFields(
        { name: '1️⃣ ' + rods.rod_1.name, value: `Chance kein Köder zu verbrauchen: 0%\nAngel-Cooldown: ${rods.rod_1.cooldown} Sekunden\nKosten: \`${rods.rod_1.price}\` 💵` },
        { name: '2️⃣ ' + rods.rod_2.name, value: `Chance kein Köder zu verbrauchen: 5%\nAngel-Cooldown: ${rods.rod_2.cooldown} Sekunden\nKosten: \`${rods.rod_2.price}\` 💵` },
        { name: '3️⃣ ' + rods.rod_3.name, value: `Chance kein Köder zu verbrauchen: 10%\nAngel-Cooldown: ${rods.rod_3.cooldown} Sekunden\nKosten: \`${rods.rod_3.price}\` 💵` },
        { name: '4️⃣ ' + rods.rod_4.name, value: `Chance kein Köder zu verbrauchen: 15%\\nAngel-Cooldown: ${rods.rod_4.cooldown} Sekunden\nKosten: \`${rods.rod_4.price}\` 💵` }
    )
    .setColor('#f77600');

module.exports = {
    description: 'Öffnet das Shop-Menü',
    callback: async ({ client, interaction }) => {
        const guildId = interaction.guild_id;
        const userId = interaction.member.user.id;
        const channel = client.channels.cache.get(interaction.channel_id);
		const targetCoins = await getCoins(guildId, userId);
        const p_save = await profile.findOne({ userId });
		const userBusiness = await getBusiness(guildId, userId);
        const setcompany = await setCompany(guildId, userId)

        setTimeout(() => {
            channel.send(shopEmbed).then(msg => {
                handleShop(msg)
            })
        }, 500);
        return 'Lade den Shop...';

        function handleShop(shop_msg) {
            const filter = m => m.author.id === userId;
            channel.awaitMessages(filter, {
                max: 1,
                time: 60000,
                errors: ['time'],
            })
            .then(async msg => {
                msg = msg.first()
                msg.delete();
                if (msg.content == '1') {
                    const buyEmbed = new MessageEmbed()
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
                    shop_msg.edit(buyEmbed).then(m => {
                        handleBuy(shop_msg)
                    })
                } else if (msg.content == '2') {
                    if (!setcompany) {
                        shop_msg.delete()
                        channel.send(no + ' Du brauchst ein Business um Upgrades zu kaufen!')
                        return;
                    }
                    const upgradeEmbed = new MessageEmbed()
                    .setTitle('Verfügbare Upgrades')
                    .addFields(
                        { name: ':one: Personalupgrade', value: `Stelle mehr Personal ein, um mehr zu produzieren!\nKosten:  \`${format(setcompany.priceUpgrade1)}\` 💵` },
                        { name: ':two: Besserer Zulieferer', value: `Kaufe deine Rohware bei einem zuverlässigerem Zulieferer ein!\nKosten:  \`${format(setcompany.priceUpgrade2)}\` 💵` },
                        { name: `:three: ${setcompany.nameUpgrade3}`, value: `Kaufe für eine bessere Produktion ${setcompany.textUpgrade3}!\nKosten:  \`${format(setcompany.priceUpgrade3)}\` 💵` },
                    )
                    .setFooter('Reagiere innerhalb von 60 Sekunden um ein Unternehmen zu verbessern.')
                    .setColor('#2f3136');
                    shop_msg.edit(upgradeEmbed).then(m => {
                        handleUpgrade(shop_msg)
                    })
                } else if (msg.content == '3') {
                    shop_msg.edit(bagEmbed).then(m => {
                        handleBag(shop_msg);
                    })
                } else if (msg.content == '4') {
                    shop_msg.edit(rodEmbed).then(m => {
                        handleRod(shop_msg);
                    })
                } else {
                    shop_msg.delete();
                    channel.send(no + ' Keine gültige Eingabe erkannt.')
                }
            })
            .catch(() => {
                shop_msg.delete()
                channel.send(no + ' Der Shop wurde aufgrund von Inaktivität geschlossen.')
            })
        }
        
        function handleBuy(shop_msg) {
            const filter = m => m.author.id === userId;
            channel.awaitMessages(filter, {
                max: 1,
                time: 60000,
                errors: ['time'],
            })
            .then(async msg => {
                msg = msg.first()
                msg.delete();
                let company;
                if (msg.content == '1') {
                    company = documents;
                } else if (msg.content == '2') {
                    company = weed;
                } else if (msg.content == '3') {
                    company = fakeMoney;
                } else if (msg.content == '4') {
                    company = meth;
                } else if (msg.content == '5') {
                    company = cocaine;
                } else {
                    shop_msg.delete()
                    channel.send(no + 'Keine gültige Eingabe erkannt.')
                }
                if (targetCoins < company.price) {
                    shop_msg.delete()
                    channel.send(no + ' Du hast nicht genug Credits um dir dieses Unternehmen leisten zu können!');
                    return;
                }
                if (userBusiness !== null) {
                    if (userBusiness.type === company.name) {
                        shop_msg.delete()
                        channel.send(no + ' Du besitzt bereits dieses Unternehmen!');
                        return;
                    }
                }
                await buyBusiness(guildId, userId, company.name);
                await addCoins(guildId, userId, company.price * -1);
                const invoiceEmbed = new MessageEmbed()
                .setTitle(yes + ' |  Einkauf erfolgreich')
                .addField('Rechung', `- ${company.name}\nKosten: \`${format(company.price)}\` 💵`)
                .setColor('#f77600');
                shop_msg.edit(invoiceEmbed)
            })
            .catch(() => {
                shop_msg.delete()
                channel.send(no + ' Der Shop wurde aufgrund von Inaktivität geschlossen.')
            })
        }

        async function handleUpgrade(shop_msg) {
            const filter = m => m.author.id === userId;
            channel.awaitMessages(filter, {
                max: 1,
                time: 60000,
                errors: ['time'],
            })
            .then(async msg => {
                msg = msg.first()
                msg.delete();
                if (msg.content == '1') {
                    if (userBusiness.upgrade1 === true) {
                        shop_msg.delete()
                        channel.send(no + 'Du hast bereits mehr Personal eingestellt!');
                        return;
                    }
                    if (targetCoins < setcompany.priceUpgrade1) {
                        shop_msg.delete()
                        channel.send(no + `Du hast doch gar nicht ${format(setcompany.priceUpgrade1)} 💵 <:Susge:809947745342980106>`);
                        return;
                    }
                    await buyUpgrade1(guildId, userId, userBusiness.type);
                    await addCoins(guildId, userId, setcompany.priceUpgrade1 * -1);
                    const invoiceEmbed = new MessageEmbed()
                    .setTitle(yes + ' |  Einkauf erfolgreich')
                    .addField('Rechung', `- Personaluprade\nKosten: \`${format(setcompany.priceUpgrade1)}\` 💵`)
                    .setColor('#f77600');
                    shop_msg.edit(invoiceEmbed)
                } else if (msg.content == '2') {
                    if (userBusiness.upgrade2 === true) {
                        shop_msg.delete()
                        channel.send(no + 'Du kaufst bereits bei einem besseren Zulieferer!');
                        return;
                    }
                    if (targetCoins < setcompany.priceUpgrade2) {
                        shop_msg.delete()
                        channel.send(no + `Du hast doch gar nicht ${format(setcompany.priceUpgrade2)} 💵 <:Susge:809947745342980106>`);
                        return;
                    }
                    await buyUpgrade2(guildId, userId, userBusiness.type);
                    await addCoins(guildId, userId, setcompany.priceUpgrade2 * -1);
                    const invoiceEmbed = new MessageEmbed()
                    .setTitle(yes + ' |  Einkauf erfolgreich')
                    .addField('Rechung', `- Besserer Zulieferer\nKosten: \`${format(setcompany.priceUpgrade2)}\` 💵`)
                    .setColor('#f77600');
                    shop_msg.edit(invoiceEmbed)
                } else if (msg.content == '3') {
                    if (userBusiness.upgrade3 === true) {
                        shop_msg.delete()
                        channel.send(no + `Du hast bereits ${setcompany.textUpgrade3}!`);
                        return;
                    }
                    if (targetCoins < setcompany.priceUpgrade3) {
                        shop_msg.delete()
                        channel.send(no + `Du hast doch gar nicht ${format(setcompany.priceUpgrade3)} 💵 <:Susge:809947745342980106>`);
                        return;
                    }
                    await buyUpgrade3(guildId, userId, userBusiness.type);
                    await addCoins(guildId, userId, setcompany.priceUpgrade3 * -1);
                    const invoiceEmbed = new MessageEmbed()
                    .setTitle(yes + ' |  Einkauf erfolgreich')
                    .addField('Rechung', `- ${setcompany.textUpgrade3}\nKosten: \`${format(setcompany.priceUpgrade3)}\` 💵`)
                    .setColor('#f77600');
                    shop_msg.edit(invoiceEmbed)
                } else {
                    shop_msg.delete()
                    channel.send(no + 'Keine gültige Eingabe erkannt.')
                }
            })
            .catch(() => {
                shop_msg.delete()
                channel.send(no + ' Der Shop wurde aufgrund von Inaktivität geschlossen.')
            })
        }

        function handleBag(shop_msg) {
            const filter = m => m.author.id === userId;
            channel.awaitMessages(filter, {
                max: 1,
                time: 60000,
                errors: ['time'],
            })
            .then(async msg => {
                msg = msg.first()
                msg.delete();
                if (msg.content == '1') {
                    if (targetCoins < bags.bag_1.price) {
                        shop_msg.delete()
                        channel.send(no + ' Du hast nicht genug Credits um dir das leisten zu können!');
                        return;
                    }
                    if (p_save.bag == 'bag_1') {
                        shop_msg.delete()
                        channel.send(no + ' Du hast bereits diesen Rucksack.');
                        return;
                    }
                    await setBag(userId, 'bag_1');
                    await addCoins(guildId, userId, bags.bag_1.price * -1);
                    const invoiceEmbed = new MessageEmbed()
                        .setTitle(yes + ' |  Einkauf erfolgreich')
                        .addField('Rechung', `- ${bags.bag_1.name}\nKosten: \`${bags.bag_1.price}\` 💵`)
                        .setColor('#f77600');
                    shop_msg.edit(invoiceEmbed)
                } else if (msg.content == '2') {
                    if (targetCoins < bags.bag_2.price) {
                        shop_msg.delete()
                        channel.send(no + ' Du hast nicht genug Credits um dir das leisten zu können!');
                        return;
                    }
                    if (p_save.bag == 'bag_2') {
                        shop_msg.delete()
                        channel.send(no + ' Du hast bereits diesen Rucksack.');
                        return;
                    }
                    await setBag(userId, 'bag_2');
                    await addCoins(guildId, userId, bags.bag_2.price * -1);
                    const invoiceEmbed = new MessageEmbed()
                        .setTitle(yes + ' |  Einkauf erfolgreich')
                        .addField('Rechung', `- ${bags.bag_2.name}\nKosten: \`${bags.bag_2.price}\` 💵`)
                        .setColor('#f77600');
                    shop_msg.edit(invoiceEmbed)
                } else if (msg.content == '3') {
                    if (targetCoins < bags.bag_3.price) {
                        shop_msg.delete()
                        channel.send(no + ' Du hast nicht genug Credits um dir das leisten zu können!');
                        return;
                    }
                    if (p_save.bag == 'bag_3') {
                        shop_msg.delete()
                        channel.send(no + ' Du hast bereits diesen Rucksack.');
                        return;
                    }
                    await setBag(userId, 'bag_3');
                    await addCoins(guildId, userId, bags.bag_3.price * -1);
                    const invoiceEmbed = new MessageEmbed()
                        .setTitle(yes + ' |  Einkauf erfolgreich')
                        .addField('Rechung', `- ${bags.bag_3.name}\nKosten: \`${bags.bag_3.price}\` 💵`)
                        .setColor('#f77600');
                    shop_msg.edit(invoiceEmbed)
                } else if (msg.content == '4') {
                    if (targetCoins < bags.bag_4.price) {
                        shop_msg.delete()
                        channel.send(no + ' Du hast nicht genug Credits um dir das leisten zu können!');
                        return;
                    }
                    if (p_save.bag == 'bag_4') {
                        shop_msg.delete()
                        channel.send(no + ' Du hast bereits diesen Rucksack.');
                        return;
                    }
                    await setBag(userId, 'bag_4');
                    await addCoins(guildId, userId, bags.bag_4.price * -1);
                    const invoiceEmbed = new MessageEmbed()
                        .setTitle(yes + ' |  Einkauf erfolgreich')
                        .addField('Rechung', `- ${bags.bag_4.name}\nKosten: \`${bags.bag_4.price}\` 💵`)
                        .setColor('#f77600');
                    shop_msg.edit(invoiceEmbed)
                } else {
                    shop_msg.delete();
                    channel.send(no + ' Keine gültige Eingabe erkannt.');
                }
            })
            .catch(() => {
                shop_msg.delete()
                channel.send(no + ' Der Shop wurde aufgrund von Inaktivität geschlossen.')
            })
        }

        function handleRod(shop_msg) {
            const filter = m => m.author.id === userId;
            channel.awaitMessages(filter, {
                max: 1,
                time: 60000,
                errors: ['time'],
            })
            .then(async msg => {
                msg = msg.first()
                msg.delete();
                if (msg.content == '1') {
                    if (targetCoins < rods.rod_1.price) {
                        shop_msg.delete()
                        channel.send(no + ' Du hast nicht genug Credits um dir das leisten zu können!');
                        return;
                    }
                    if (p_save.rod == 'rod_1') {
                        shop_msg.delete()
                        channel.send(no + ' Du hast bereits diese Angel.');
                        return;
                    }
                    await setRod(userId, 'rod_1');
                    await addCoins(guildId, userId, rods.rod_1.price * -1);
                    const invoiceEmbed = new MessageEmbed()
                    .setTitle(yes + ' |  Einkauf erfolgreich')
                    .addField('Rechung', `- ${rods.rod_1.name}\nKosten: \`${rods.rod_1.price}\` 💵`)
                    .setColor('#f77600');
                    shop_msg.edit(invoiceEmbed)
                }
                else if (msg.content == '2') {
                    if (targetCoins < rods.rod_2.price) {
                        shop_msg.delete()
                        channel.send(no + ' Du hast nicht genug Credits um dir das leisten zu können!');
                        return;
                    }
                    if (p_save.rod == 'rod_2') {
                        shop_msg.delete()
                        channel.send(no + ' Du hast bereits diese Angel.');
                        return;
                    }
                    await setRod(userId, 'rod_2');
                    await addCoins(guildId, userId, rods.rod_2.price * -1);
                    const invoiceEmbed = new MessageEmbed()
                    .setTitle(yes + ' |  Einkauf erfolgreich')
                    .addField('Rechung', `- ${rods.rod_2.name}\nKosten: \`${rods.rod_2.price}\` 💵`)
                    .setColor('#f77600');
                    shop_msg.edit(invoiceEmbed)
                }
                else if (msg.content == '3') {
                    if (targetCoins < rods.rod_3.price) {
                        shop_msg.delete()
                        channel.send(no + ' Du hast nicht genug Credits um dir das leisten zu können!');
                        return;
                    }
                    if (p_save.rod == 'rod_3') {
                        shop_msg.delete()
                        channel.send(no + ' Du hast bereits diese Angel.');
                        return;
                    }
                    await setRod(userId, 'rod_3');
                    await addCoins(guildId, userId, rods.rod_3.price * -1);
                    const invoiceEmbed = new MessageEmbed()
                        .setTitle(yes + ' |  Einkauf erfolgreich')
                        .addField('Rechung', `- ${rods.rod_3.name}\nKosten: \`${rods.rod_3.price}\` 💵`)
                        .setColor('#f77600');
                    shop_msg.edit(invoiceEmbed)
                }
                else if (msg.content == '4') {
                    if (targetCoins < rods.rod_4.price) {
                        shop_msg.delete()
                        channel.send(no + ' Du hast nicht genug Credits um dir das leisten zu können!');
                        return;
                    }
                    if (p_save.rod == 'rod_4') {
                        shop_msg.delete()
                        channel.send(no + ' Du hast bereits diese Angel.');
                        return;
                    }
                    await setRod(userId, 'rod_4');
                    await addCoins(guildId, userId, rods.rod_3.price * -1);
                    const invoiceEmbed = new MessageEmbed()
                        .setTitle(yes + ' |  Einkauf erfolgreich')
                        .addField('Rechung', `- ${rods.rod_4.name}\nKosten: \`${rods.rod_4.price}\` 💵`)
                        .setColor('#f77600');
                    shop_msg.edit(invoiceEmbed)
                } else {
                    shop_msg.delete();
                    channel.send(no + ' Keine gültige Eingabe erkannt.');
                }
            })
            .catch(() => {
                shop_msg.delete()
                channel.send(no + ' Der Shop wurde aufgrund von Inaktivität geschlossen.')
            })
        }
    }
}