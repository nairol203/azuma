const { MessageEmbed } = require("discord.js");
const { addCoins, getCoins } = require('../../features/economy');
const { bags, rods } = require('../games/fish.json');
const { rod_1, rod_2, rod_3, rod_4 } = rods;
const { bag_1, bag_2, bag_3, bag_4 } = bags;
const { setRod, setBag } = require('../../features/fishing');
const profile = require('../../models/profile');

module.exports = {
    description: 'Öffnet das Shop-Menü',
    callback: async ({ client, interaction }) => {
        const guildId = interaction.guildID;
        const channel = client.channels.cache.get(interaction.channelID);
        const userId = interaction.member.user.id;
		const userBal = await getCoins(guildId, userId);
        const p_save = await profile.findOne({ userId });

        const embed = new MessageEmbed()
            .setTitle('Azuma Shop')
            .setDescription('Wähle eine Kategorie, in der du etwas kaufen möchtest!\n\n:one: Rucksäcke\n\n:two: Angeln')
            .setFooter('Azuma | Tippe "exit" um das Menü zu schließen.', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
            .setColor('#f77600');

        await interaction.reply({ embeds: [embed] });
        handleShop();

        function handleShop() {
            const filter = m => m.author.id === userId;
            channel.awaitMessages(filter, {
                max: 1,
                time: 300000,
                errors: ['time'],
            })
            .then(async msg => {
                msg = msg.first()
                msg.delete();
                if (msg.content == '1') {
                    const bagEmbed = new MessageEmbed()
                        .setTitle('🎣 |  Rucksack kaufen')
                        .setDescription('Kaufe einen Rucksack, um mehr Fische auf einmal tragen zu können.\n**Deine Credits:** ' + Intl.NumberFormat('de-DE', { maximumSignificantDigits: 10 }).format(userBal) + ' 💵')
                        .addFields(
                            { name: '1️⃣ ' + bag_1.name , value: `Größe: ${bag_1.size}\nKosten: \`${bag_1.price}\` 💵` },
                            { name: '2️⃣ ' + bag_2.name, value: `Größe: ${bag_2.size}\nKosten: \`${bag_2.price}\` 💵` },
                            { name: '3️⃣ ' + bag_3.name, value: `Größe: ${bag_3.size}\nKosten: \`${bag_3.price}\` 💵` },
                            { name: '4️⃣ ' + bag_4.name, value: `Größe: ${bag_4.size}\nKosten: \`${bag_4.price}\` 💵` }
                        )
                        .setFooter('Azuma | Tippe "return" um in das Hauptmenü zurückzukehren.', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                        .setColor('#f77600');
                    interaction.editReply({ embeds: [bagEmbed] }).then(m => {
                        handleBag();
                    })
                }
                else if (msg.content == '2') {
                    const rodEmbed = new MessageEmbed()
                        .setTitle('🎣  |  Angeln kaufen')
                        .setDescription('Kaufe eine Angel, um Fische mit `/fish` zu fangen. Eine Angel geht nach einer Zeit kaputt.\n**Deine Credits:** ' + Intl.NumberFormat('de-DE', { maximumSignificantDigits: 10 }).format(userBal) + ' 💵')
                        .addFields(
                            { name: '1️⃣ ' + rod_1.name, value: `Chance kein Köder zu verbrauchen: ${rod_1.no_bait * 100}%\nAngel-Cooldown: ${rod_1.cooldown} Sekunden\nKosten: \`${rod_1.price}\` 💵` },
                            { name: '2️⃣ ' + rod_2.name, value: `Chance kein Köder zu verbrauchen: ${rod_2.no_bait * 100}%\nAngel-Cooldown: ${rod_2.cooldown} Sekunden\nKosten: \`${rod_2.price}\` 💵` },
                            { name: '3️⃣ ' + rod_3.name, value: `Chance kein Köder zu verbrauchen: ${rod_3.no_bait * 100}%\nAngel-Cooldown: ${rod_3.cooldown} Sekunden\nKosten: \`${rod_3.price}\` 💵` },
                            { name: '4️⃣ ' + rod_4.name, value: `Chance kein Köder zu verbrauchen: ${rod_4.no_bait * 100}%\nAngel-Cooldown: ${rod_4.cooldown} Sekunden\nKosten: \`${rod_4.price}\` 💵` }
                        )
                        .setFooter('Azuma | Tippe "return" um in das Hauptmenü zurückzukehren.', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                        .setColor('#f77600');
                    interaction.editReply({ embeds: [rodEmbed] }).then(m => {
                        handleRod();
                    })
                }
                else if (msg.content == 'exit') {
                    interaction.deleteReply();
                }
                else {
                    interaction.deleteReply();
                    interaction.followUp(`<@${userid}>, es wurde keine gültige Eingabe erkannt.`)
                };
            })
            .catch((e) => {
                interaction.deleteReply();
                interaction.followUp(`<@${userId}>, der Shop wurde aufgrund eines Errors (evtl. Inaktivität) geschlossen.`)
                console.log(e)
            })
        }

        function handleBag() {
            const filter = m => m.author.id === userId;
            channel.awaitMessages(filter, {
                max: 1,
                time: 300000,
                errors: ['time'],
            })
            .then(async msg => {
                msg = msg.first()
                msg.delete();
                if (msg.content == '1') {
                    if (userBal < bag_1.price) {
                        interaction.deleteReply();
                        interaction.followUp(`<@${userId}>, du hast nicht genug Credits um dir das leisten zu können!`);
                        return;
                    }
                    if (p_save.bag == 'bag_1') {
                        interaction.deleteReply();
                        interaction.followUp(`<@${userId}>, du hast bereits diesen Rucksack.`);
                        return;
                    }
                    await setBag(userId, 'bag_1');
                    await addCoins(guildId, userId, bag_1.price * -1);
                    const invoiceEmbed = new MessageEmbed()
                        .setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.webp`)
                        .addField('Rechung', `- ${bag_1.name}\nKosten: \`${bag_1.price}\` 💵`)
                        .setFooter('Azuma | Contact @florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                        .setColor('#f77600');
                        interaction.editReply({ embeds: [invoiceEmbed] })
                }
                else if (msg.content == '2') {
                    if (userBal < bag_2.price) {
                        interaction.deleteReply();
                        interaction.followUp(`<@${userId}>, du hast nicht genug Credits um dir das leisten zu können!`);
                        return;
                    }
                    if (p_save.bag == 'bag_2') {
                        interaction.deleteReply();
                        interaction.followUp(`<@${userId}>, du hast bereits diesen Rucksack.`);
                        return;
                    }
                    await setBag(userId, 'bag_2');
                    await addCoins(guildId, userId, bag_2.price * -1);
                    const invoiceEmbed = new MessageEmbed()
                        .setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.webp`)
                        .addField('Rechung', `- ${bag_2.name}\nKosten: \`${bag_2.price}\` 💵`)
                        .setFooter('Azuma | Contact @florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                        .setColor('#f77600');
                    interaction.editReply({ embeds: [invoiceEmbed] });
                }
                else if (msg.content == '3') {
                    if (userBal < bag_3.price) {
                        interaction.deleteReply();
                        interaction.followUp(`<@${userId}>, du hast nicht genug Credits um dir das leisten zu können!`);
                        return;
                    }
                    if (p_save.bag == 'bag_3') {
                        interaction.deleteReply();
                        interaction.followUp(`<@${userId}>, du hast bereits diesen Rucksack.`);
                        return;
                    }
                    await setBag(userId, 'bag_3');
                    await addCoins(guildId, userId, bag_3.price * -1);
                    const invoiceEmbed = new MessageEmbed()
                        .setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.webp`)
                        .addField('Rechung', `- ${bag_3.name}\nKosten: \`${bag_3.price}\` 💵`)
                        .setFooter('Azuma | Contact @florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                        .setColor('#f77600');
                    interaction.editReply({ embeds: [invoiceEmbed] });
                }
                else if (msg.content == '4') {
                    if (userBal < bag_4.price) {
                        interaction.deleteReply();
                        interaction.followUp(`<@${userId}>, du hast nicht genug Credits um dir das leisten zu können!`);
                        return;
                    }
                    if (p_save.bag == 'bag_4') {
                        interaction.deleteReply();
                        interaction.followUp(`<@${userId}>, du hast bereits diesen Rucksack.`);
                        return;
                    }
                    await setBag(userId, 'bag_4');
                    await addCoins(guildId, userId, bag_4.price * -1);
                    const invoiceEmbed = new MessageEmbed()
                        .setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.webp`)
                        .addField('Rechung', `- ${bag_4.name}\nKosten: \`${bag_4.price}\` 💵`)
                        .setFooter('Azuma | Contact @florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                        .setColor('#f77600');
                    interaction.editReply({ embeds: [invoiceEmbed] });
                }
                else if (msg.content == 'return') {
                    interaction.editReply({ embeds: [embed] });
                    handleShop();
                }
                else {
                    interaction.deleteReply();
                    interaction.followUp(`<@${userid}>, es wurde keine gültige Eingabe erkannt.`);
                };
            })
            .catch((e) => {
                interaction.deleteReply();
                interaction.followUp(`<@${userId}>, der Shop wurde aufgrund eines Errors (evtl. Inaktivität) geschlossen.`);
                console.error(e);
            });
        };

        function handleRod() {
            const filter = m => m.author.id === userId;
            channel.awaitMessages(filter, {
                max: 1,
                time: 300000,
                errors: ['time'],
            })
            .then(async msg => {
                msg = msg.first()
                msg.delete();
                if (msg.content == '1') {
                    if (userBal < rod_1.price) {
                        interaction.deleteReply();
                        interaction.followUp(`<@${userId}>, du hast nicht genug Credits um dir das leisten zu können!`);
                        return;
                    }
                    if (p_save.rod == 'rod_1') {
                        interaction.deleteReply();
                        interaction.followUp(`<@${userId}>, du besitzt bereits diese Angel.`);
                        return;
                    }
                    await setRod(userId, 'rod_1');
                    await addCoins(guildId, userId, rod_1.price * -1);
                    const invoiceEmbed = new MessageEmbed()
                        .setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.webp`)
                        .addField('Rechung', `- ${rod_1.name}\nKosten: \`${rod_1.price}\` 💵`)
                        .setFooter('Azuma | Contact @florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                        .setColor('#f77600');
                    interaction.editReply({ embeds: [invoiceEmbed] });
                }
                else if (msg.content == '2') {
                    if (userBal < rod_2.price) {
                        interaction.deleteReply();
                        interaction.followUp(`<@${userId}>, du hast nicht genug Credits um dir das leisten zu können!`);
                        return;
                    }
                    if (p_save.rod == 'rod_2') {
                        interaction.deleteReply();
                        interaction.followUp(`<@${userId}>, du besitzt bereits diese Angel.`);
                        return;
                    }
                    await setRod(userId, 'rod_2');
                    await addCoins(guildId, userId, rod_2.price * -1);
                    const invoiceEmbed = new MessageEmbed()
                        .setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.webp`)
                        .addField('Rechung', `- ${rod_2.name}\nKosten: \`${rod_2.price}\` 💵`)
                        .setFooter('Azuma | Contact @florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                        .setColor('#f77600');
                    interaction.editReply({ embeds: [invoiceEmbed] });
                }
                else if (msg.content == '3') {
                    if (userBal < rod_3.price) {
                        interaction.deleteReply();
                        interaction.followUp(`<@${userId}>, du hast nicht genug Credits um dir das leisten zu können!`);
                        return;
                    }
                    if (p_save.rod == 'rod_3') {
                        interaction.deleteReply();
                        interaction.followUp(`<@${userId}>, du besitzt bereits diese Angel.`);
                        return;
                    }
                    await setRod(userId, 'rod_3');
                    await addCoins(guildId, userId, rod_3.price * -1);
                    const invoiceEmbed = new MessageEmbed()
                        .setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.webp`)
                        .addField('Rechung', `- ${rod_3.name}\nKosten: \`${rod_3.price}\` 💵`)
                        .setFooter('Azuma | Contact @florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                        .setColor('#f77600');
                    interaction.editReply({ embeds: [invoiceEmbed] });
                }
                else if (msg.content == '4') {
                    if (userBal < rod_4.price) {
                        interaction.deleteReply();
                        interaction.followUp(`<@${userId}>, du hast nicht genug Credits um dir das leisten zu können!`);
                        return;
                    }
                    if (p_save.rod == 'rod_4') {
                        interaction.deleteReply();
                        interaction.followUp(`<@${userId}>, du besitzt bereits diese Angel.`);
                        return;
                    }
                    await setRod(userId, 'rod_4');
                    await addCoins(guildId, userId, rod_3.price * -1);
                    const invoiceEmbed = new MessageEmbed()
                        .setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.webp`)
                        .addField('Rechung', `- ${rod_4.name}\nKosten: \`${rod_4.price}\` 💵`)
                        .setFooter('Azuma | Contact @florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                        .setColor('#f77600');
                    interaction.editReply({ embeds: [invoiceEmbed] });
                }
                else if (msg.content == 'return') {
                    interaction.editReply({ embeds: [embed] });
                    handleShop();
                }
                else {
                    interaction.deleteReply();
                    interaction.followUp(`<@${userid}>, es wurde keine gültige Eingabe erkannt.`);
                }
            })
            .catch((e) => {
                interaction.deleteReply();
                interaction.followUp(`<@${userId}>, der Shop wurde aufgrund eines Errors (evtl. Inaktivität) geschlossen.`);
                console.error(e);
            });
        };
    },
};