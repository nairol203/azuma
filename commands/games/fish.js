const { Collection, MessageEmbed, Message } = require('discord.js');
const { Menu } = require('discord.js-menu')
const { bags, fish, rods, baits } = require('./fish.json');
const { bait_1, bait_2, bait_3 } = baits;
const { no, gold, silver, bronze } = require('../../emoji.json');
const { commons, uncommons, rares, garbage } = fish;
const { findCommon, findUncommon, findRare, findGarbage, addCommon, addUncommon, addRare, addGarbage, addBagSize, addBagValue, setBag, activeBait, getStats, getCommonStats, getUncommonStats, getRareStats, getGarbageStats, getAllStats } = require('../../features/fishing');
const profile = require('../../models/profile');
const { addCoins, getCoins } = require('../../features/economy');

const cooldowns = new Collection();

module.exports = {
    update: true,
    description: 'Fischen in Discord!',
    options: [
        {
            name: 'options',
            description: 'Fischen in Discord!',
            type: 3,
            choices: [
                { name: 'collection', value : 'collection' },
                { name: 'sell', value : 'sell' },
                { name: 'stats', value : 'stats' },
                { name: 'bait', value: 'bait' },
                { name: 'rares', value: 'rares' },
                { name: 'wiki', value: 'wiki' }
            ],
        },
    ],
    callback: async ({ client, args, interaction }) => {
        const guildId = interaction.guild_id;
        const channel = client.channels.cache.get(interaction.channel_id);
        const user = interaction.member.user;
        const userId = user.id;
        const p_save = await profile.findOne({ userId });
        const targetCoins = await getCoins(guildId, userId);
        if (args.options == 'bait') {
            const embed = new MessageEmbed()
                .setTitle('Wähle einen Köder aus!')
                .addFields(
                    { name: '1️⃣ **Standardköder**', value: '**Kosten:** 10 💵' },
                    { name: '2️⃣ ' + bait_1.name, value: bait_1.description + '\n**Kosten:** ' + bait_1.price + ' 💵' },
                    { name: '3️⃣ ' + bait_2.name, value: bait_2.description + '\n**Kosten:** ' + bait_2.price + ' 💵'  },
                    { name: '4️⃣ ' + bait_3.name, value: bait_3.description + '\n**Kosten:** ' + bait_3.price + ' 💵'  },
                )
                .setColor('#2773fc');
            setTimeout(() => {
                channel.send(embed).then(m => {
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
                            await activeBait(userId, undefined);
                            const embed = new MessageEmbed()
                                .setTitle('Köder ausgewählt')
                                .setDescription('Du fischt jetzt mit dem Standardköder!')
                                .addFields(
                                    { name: 'Chances', value: `${commons.Sardelle.emoji} Commons: ${(baits.default.chances.common * 100).toFixed(2)}%\n${uncommons.Regenbogenforelle.emoji} Uncommons: ${(baits.default.chances.uncommon * 100).toFixed(2)}%\n${rares.Purpurfisch.emoji} Rares: ${(baits.default.chances.rare * 100).toFixed(2)}%\n${garbage.Grünalge.emoji} Garbage: ${(baits.default.chances.garbage * 100).toFixed(2)}%`, inline: true },
                                    { name: 'Preis', value: '10 💵', inline: true },
                                )
                                .setColor('#2773fc')
                            m.edit(embed)
                        } else if (msg.content == '2') {
                            await activeBait(userId, 'bait_1');
                            const embed = new MessageEmbed()
                                .setTitle('Köder ausgewählt')
                                .setDescription('Du fischt jetzt mit dem Köder ' + bait_1.name + '!')
                                .addFields(
                                    { name: 'Chances', value: `${commons.Sardelle.emoji} Commons: ${(bait_1.chances.common * 100).toFixed(2)}%\n${uncommons.Regenbogenforelle.emoji} Uncommons: ${(bait_1.chances.uncommon * 100).toFixed(2)}%\n${rares.Purpurfisch.emoji} Rares: ${(bait_1.chances.rare * 100).toFixed(2)}%\n${garbage.Grünalge.emoji} Garbage: ${(bait_1.chances.garbage * 100).toFixed(2)}%`, inline: true },
                                    { name: 'Preis', value: bait_1.price + ' 💵', inline: true },
                                )
                                .setColor('#2773fc')
                            m.edit(embed)
                        }
                        else if (msg.content == '3') {
                            await activeBait(userId, 'bait_2');
                            const embed = new MessageEmbed()
                                .setTitle('Köder ausgewählt')
                                .setDescription('Du fischt jetzt mit dem Köder ' + bait_2.name + '!')
                                .addFields(
                                    { name: 'Chances', value: `${commons.Sardelle.emoji} Commons: ${(bait_2.chances.common * 100).toFixed(2)}%\n${uncommons.Regenbogenforelle.emoji} Uncommons: ${(bait_2.chances.uncommon * 100).toFixed(2)}%\n${rares.Purpurfisch.emoji} Rares: ${(bait_2.chances.rare * 100).toFixed(2)}%\n${garbage.Grünalge.emoji} Garbage: ${(bait_2.chances.garbage * 100).toFixed(2)}%`, inline: true },
                                    { name: 'Preis', value: bait_2.price + ' 💵', inline: true },
                                )
                                .setColor('#2773fc')
                            m.edit(embed)
                        }
                        else if (msg.content == '4') {
                            await activeBait(userId, 'bait_3');
                            const embed = new MessageEmbed()
                                .setTitle('Köder ausgewählt')
                                .setDescription('Du fischt jetzt mit dem Köder ' + bait_3.name + '!')
                                .addFields(
                                    { name: 'Chances', value: `${commons.Sardelle.emoji} Commons: ${(bait_3.chances.common * 100).toFixed(2)}%\n${uncommons.Regenbogenforelle.emoji} Uncommons: ${(bait_3.chances.uncommon * 100).toFixed(2)}%\n${rares.Purpurfisch.emoji} Rares: ${(bait_3.chances.rare * 100).toFixed(2)}%\n${garbage.Grünalge.emoji} Garbage: ${(bait_3.chances.garbage * 100).toFixed(2)}%`, inline: true },
                                    { name: 'Preis', value: bait_3.price + ' 💵', inline: true },
                                )
                                .setColor('#2773fc')
                            m.edit(embed)
                        } else {
                            m.delete()
                            channel.send(no + ' Keine gültige Eingabe erkannt!')
                        }
                    })
                    .catch(() => {
                        m.delete()
                        channel.send(no + ' Die Köderauswahl wurde aufgrund von Inaktivität geschlossen.')
                    })
                })
            }, 500);
            return 'Wähle einen aktiven Köder...';
        } else if (args.options == 'collection') {
            const stats = await getStats(userId);
            if (!stats || !stats.length) {
                return [ no + ' Du hast noch keine Fische gefangen! Fange jetzt damit an: `/fish`' ];
            }
            const embed_1 = new MessageEmbed()
                .setTitle('Fishing collection')
                .setDescription('Dies sind alle Fische die du bereits gefangen hast!')
                .setFooter('Seite 1/3')
                .setColor('#2773fc');
            stats.slice(0, 12).map(stat => {
                let value = stat.amount + ' Stück';
                if (stat.length) {
                    value = value + '\nLängster Fang: ' + stat.length + 'cm';
                }
                embed_1.addField(stat.emoji + ' ' + stat.name, value, true)
            })
            const embed_2 = new MessageEmbed()
                .setTitle('Fishing collection')
                .setDescription('Dies sind alle Fische die du bereits gefangen hast!')
                .setFooter('Seite 2/3')
                .setColor('#2773fc');
            stats.slice(12, 24).map(stat => {
                let value = stat.amount + ' Stück';
                if (stat.length) {
                    value = value + '\nLängster Fang: ' + stat.length + 'cm';
                }
                embed_2.addField(stat.emoji + ' ' + stat.name, value, true)
            })
            const embed_3 = new MessageEmbed()
                .setTitle('Fishing collection')
                .setDescription('Dies sind alle Fische die du bereits gefangen hast!')
                .setFooter('Seite 3/3')
                .setColor('#2773fc');
            stats.slice(24, 36).map(stat => {
                let value = stat.amount + ' Stück';
                if (stat.length) {
                    value = value + '\nLängster Fang: ' + stat.length + 'cm';
                }
                embed_3.addField(stat.emoji + ' ' + stat.name, value, true)
            })
            let collectionMenu = new Menu(channel, userId, [
                {
                    name: 'first',
                    content: embed_1,
                    reactions: {
                        '⬅': 'first',
                        '➡': 'second',
                    }
                },
                {
                    name: 'second',
                    content: embed_2,
                    reactions: {
                        '⬅': 'first',
                        '➡': 'last',
                    }
                },
                {
                    name: 'last',
                    content: embed_3,
                    reactions: {
                        '⬅': 'second',
                        '➡': 'last',
                    }
                }
            ])
            if (stats.length > 12) {
                collectionMenu.start()
            } else {
                if (stats.length > 0) {
                    const embed = new MessageEmbed()
                    .setTitle('Fishing collection')
                    .setDescription('Dies sind alle Fische die du bereits gefangen hast!')
                    .setColor('#2773fc');
                stats.slice(0, 12).map(stat => {
                    let value = stat.amount + ' Stück';
                    if (stat.length) {
                        value = value + '\nLängster Fang: ' + stat.length + 'cm';
                    }
                    embed.addField(stat.emoji + ' ' + stat.name, value, true)
                })
                    return embed;
                } else {
                    return [ 'Du hast noch keine Fische gefangen! Fange jetzt damit an: `/fish`' ];
                }
            }
            return 'Lade Fishing collection...';
        } else if (args.options == 'sell') {
            if (!p_save || !p_save.bag_size || !p_save.bag_value) {
                return [ no + ' Du hast aktuell keine Fische zum verkaufen!' ];
            }
            await profile.findOneAndUpdate(
                { 
                    userId 
                },
                { 
                    userId,
                    bag_size: 0,
                    bag_value: 0,
                }
            );
            await addCoins(guildId, userId, p_save.bag_value);
            return `Du hast ${p_save.bag_size || 0} Fische verkauft und \`${p_save.bag_value || 0}\` 💵 verdient.`;
        } else if (args.options == 'stats') {
            let cAmount = 0; let uAmount = 0; let rAmount = 0; let gAmount = 0;
            for (c of await getCommonStats(userId)) {
                cAmount = cAmount + c.amount;
            }
            for (u of await getUncommonStats(userId)) {
                uAmount = uAmount + u.amount;
            }
            for (r of await getRareStats(userId)) {
                rAmount = rAmount + r.amount;
            }
            for (g of await getGarbageStats(userId)) {
                gAmount = gAmount + g.amount;
            }
            let length; let amount;
            for (stats of await getAllStats(userId)) {
                if (!length) length = stats;
                if (length.length < stats.length) length = stats;
                if (!amount) amount = stats;
                if (amount.amount < stats.amount) amount = stats;
            }
            const embed = new MessageEmbed()
                .setTitle('Fishing stats')
                .setDescription('Für genauere Stats zu den einzelnen Fischen\nbenutze `/fish collection`.')
                .addFields(
                    { name: 'Längster Fisch', value: length.emoji + ' ' + length.name + '\n' + length.length + ' cm', inline: true },
                    { name: 'Meist gefangner Fisch', value: amount.emoji + ' ' + amount.name + '\n' + amount.amount + ' Stück', inline: true },
                    { name: 'Stats', value: `${commons.Sardelle.emoji} Commons: ${cAmount} Stück\n${uncommons.Regenbogenforelle.emoji} Uncommons: ${uAmount} Stück\n${rares.Purpurfisch.emoji} Rares: ${rAmount} Stück\n${garbage.Grünalge.emoji} Garbage: ${gAmount} Stück`},
                )
                .setColor('#2773fc');
            return embed;
        } else if (args.options == 'rares') {
            const rares = findRare(userId);
            const embed = new MessageEmbed()
                .setTitle('Fishing stats')
                .setDescription('Das sind alle Rares, die du bereits gefangen hast!')
                .setColor('#2773fc');
            rares.map(rare => {
                embed.addField(rare.emoji + ' ' + rare.name, rare.amount + ' Stück\nLängster Fang: ' + rare.length + 'cm')
            })
            return embed;
        } else if (args.options === 'wiki') {
            const embed = new MessageEmbed()
                .setTitle('Fishing wiki')
                .setDescription(`
**:one: Suche**
Suche nach einem bestimmten Item/ Fisch!

Andere Kategorien:
**:two: Commons**
**:three: Uncommons**
**:four: Rares**
**:five: Garbage**
**:six: Angeln**
**:seven: Bags**
**:eight: Baits**`)
                .setColor('#2773fc');
            setTimeout(() => {
                main()
            }, 500);
            return 'Lade das Wiki...';

            function main() {
                channel.send(embed).then(mainMsg => {
                    const filter = m => m.author.id === userId;
                    channel.awaitMessages(filter, {
                        max: 1,
                        time: 120000,
                        errors: ['time'],
                    })
                    .then(msg => {
                        msg = msg.first()
                        msg.delete();
                        switch(msg.content) {
                            case '1':
                                handleSearch(mainMsg)
                                break;
                            case '2':
                                handleCommons(mainMsg)
                                break;
                            case '3':
                                handleUncommons(mainMsg)
                                break;
                            case '4':
                                handleRares(mainMsg)
                                break;
                            case '5':
                                handleGarbage(mainMsg)
                                break;
                            case '6':
                                handleRods(mainMsg)
                                break;
                            case '7':
                                handleBags(mainMsg)
                                break;
                            case '8':
                                handleBaits(mainMsg)
                                break;
                            default:
                                mainMsg.delete()
                                channel.send(no + ' Keine gültige Eingabe erkannt.')
                                break;
                        }
                    })
                    .catch(() => {
                        mainMsg.delete()
                        channel.send(no + ' Das Wiki wurde aufgrund von Inaktivität geschlossen.')
                    })
                })
            }
            function handleReturn() {
                const filter = m => m.author.id === userId
                channel.awaitMessages(filter, {
                    max: 1,
                    time: 120000,
                    errors: ['time']
                })
                .then(msg => {
                    msg = msg.first()
                    if (msg.content !== 'return') return
                    msg.delete()
                    main()
                })
                .catch(() => {
                    return;
                })
            }
            function handleSearch(mainMsg) {
                mainMsg.delete()
                channel.send(no + 'Coming soon').then(msg => {
                    msg.delete({ timeout: 5000 })
                })
                main()
            }
            function handleCommons(mainMsg) {
                const embed = new MessageEmbed()
                    .setTitle('Fishing Wiki: Commons')
                    .setDescription('Das sind alle gewöhnlichen Fische!')
                    .setFooter('Tippe "return" um in das Hauptmenü zurückzukehren.')
                    .setColor('#2773fc')
                Object.values(commons).map(fish => {
                    embed.addField(fish.emoji + ' ' + fish.name, 'Länge: ' + fish.minLength + '-' + fish.maxLength + 'cm\nWert: ' + fish.minPrice + '-' + fish.maxPrice + ' 💵', true)
                })
                mainMsg.edit(embed).then(() => {
                    handleReturn()
                });
            }
            function handleUncommons(mainMsg) {
                const embed = new MessageEmbed()
                    .setTitle('Fishing Wiki: Uncommons')
                    .setDescription('Das sind alle ungewöhnlichen Fische!')
                    .setFooter('Tippe "return" um in das Hauptmenü zurückzukehren.')
                    .setColor('#2773fc')
                Object.values(uncommons).map(fish => {
                    embed.addField(fish.emoji + ' ' + fish.name, 'Länge: ' + fish.minLength + '-' + fish.maxLength + 'cm\nWert: ' + fish.minPrice + '-' + fish.maxPrice + ' 💵', true)
                })
                mainMsg.edit(embed).then(() => {
                    handleReturn()
                });
            }
            function handleRares(mainMsg) {
                const embed = new MessageEmbed()
                    .setTitle('Fishing Wiki: Rares')
                    .setDescription('Das sind alle seltenen Fische!')
                    .setFooter('Tippe "return" um in das Hauptmenü zurückzukehren.')
                    .setColor('#2773fc')
                Object.values(rares).map(fish => {
                    embed.addField(fish.emoji + ' ' + fish.name, 'Länge: ' + fish.minLength + '-' + fish.maxLength + 'cm\nWert: ' + fish.minPrice + '-' + fish.maxPrice + ' 💵', true)
                })
                mainMsg.edit(embed).then(() => {
                    handleReturn()
                });
            }
            function handleGarbage(mainMsg) {
                const embed = new MessageEmbed()
                    .setTitle('Fishing Wiki: Garbage')
                    .setDescription('Das sind die verschiedenen Müllarten!')
                    .setFooter('Tippe "return" um in das Hauptmenü zurückzukehren.')
                    .setColor('#2773fc')
                Object.values(garbage).map(fish => {
                    embed.addField(fish.emoji + ' ' + fish.name, 'Wert: 0 💵', true)
                })
                mainMsg.edit(embed).then(() => {
                    handleReturn()
                });
            }
            function handleRods(mainMsg) {
                const embed = new MessageEmbed()
                    .setTitle('Fishing Wiki: Angeln')
                    .setDescription('Das sind alle verschiedenen Angeln!')
                    .setFooter('Tippe "return" um in das Hauptmenü zurückzukehren.')
                    .setColor('#2773fc')
                Object.values(rods).map(rod => {
                    embed.addField(rod.name, 'Chance keinen Köder zu verbrauchen: ' + (rod.no_bait * 100) + '%\nAngel-Cooldown: ' + rod.cooldown + ' Sekunden\nPreis: ' + rod.price + ' 💵')
                })
                mainMsg.edit(embed).then(() => {
                    handleReturn()
                });
            }
            function handleBags(mainMsg) {
                const embed = new MessageEmbed()
                    .setTitle('Fishing Wiki: Rucksäcke')
                    .setDescription('Das sind alle verschiedenen Rucksäcke!')
                    .setFooter('Tippe "return" um in das Hauptmenü zurückzukehren.')
                    .setColor('#2773fc')
                Object.values(bags).map(bag => {
                    embed.addField(bag.name, 'Stauraum: ' + bag.size + ' Plätze\nPreis: ' + bag.price + ' 💵')
                })
                mainMsg.edit(embed).then(() => {
                    handleReturn()
                });
            }
            function handleBaits(mainMsg) {
                const embed = new MessageEmbed()
                    .setTitle('Fishing Wiki: Köder')
                    .setDescription('Das sind alle verschiedenen Köder!')
                    .setFooter('Tippe "return" um in das Hauptmenü zurückzukehren.')
                    .setColor('#2773fc')
                Object.values(baits).map(bait => {
                    embed.addField(bait.name, bait.description + `\n- Chances:\n${commons.Sardelle.emoji} Commons: ${(bait.chances.common * 100).toFixed(2)}%\n${uncommons.Regenbogenforelle.emoji} Uncommons: ${(bait.chances.uncommon * 100).toFixed(2)}%\n${rares.Purpurfisch.emoji} Rares: ${(bait.chances.rare * 100).toFixed(2)}%\n${garbage.Grünalge.emoji} Garbage: ${(bait.chances.garbage * 100).toFixed(2)}%\n- Preis: ` + bait.price + ' 💵')
                })
                mainMsg.edit(embed).then(() => {
                    handleReturn()
                });
            }
        }
        if ((!p_save) || (!p_save.rod)) {
            return  [ no + ' Du brauchst eine Angel um zu Fischen! Kaufe eine im Shop!' ];
        }
        if (targetCoins < baits[p_save.active_bait || 'default'].price) {
            return [ no + ' Du hast nicht genügend Credits um zu Fischen!' ];
        }
        if (!p_save.bag) {
            await setBag(userId, 'bag_1');
        }
        if (p_save.bag) {
            const userBag = bags[p_save.bag]
            if (userBag.size <= p_save.bag_size) {
                return [ no + ' Dein Rucksack ist voll! Verkaufe Fische mit `/fish <sell>` oder kaufe einen größeren Rucksack im Shop.' ];
            }
        }

        if (!cooldowns.has('fish')) cooldowns.set('fish', new Collection());
		const now = Date.now();
		const timestamps = cooldowns.get('fish');
		const cooldownAmount = (rods[p_save.rod].cooldown || 30) * 1000;
		if (timestamps.has(userId)) {
			const expirationTime = timestamps.get(userId) + cooldownAmount;
			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return [ no + ` Du kannst in ${timeLeft.toFixed(0)} Sekunden wieder fischen.` ];
			}
		}
		timestamps.set(userId, now);
		setTimeout(() => timestamps.delete(userId), cooldownAmount);

        const userRod = rods[p_save.rod];
        const randomNumber = Math.random();
        let types; let emoji; let usedBait; let skipBait
        if (p_save.active_bait == 'bait_1') {
            if (randomNumber < userRod.no_bait) {
                skipBait = true;
            } else {
                await addCoins(guildId, userId, bait_1.price * -1);
            }
            chances = bait_1.chances;
            usedBait = bait_1.name;
        } else if (p_save.active_bait == 'bait_2') {
            if (randomNumber < userRod.no_bait) {
                skipBait = true;
            } else {
                await addCoins(guildId, userId, bait_2.price * -1);
            }
            chances = bait_2.chances;
            usedBait = bait_2.name;
        } else if (p_save.active_bait == 'bait_3') {
            if (randomNumber < userRod.no_bait) {
                skipBait = true;
            } else {
                await addCoins(guildId, userId, bait_3.price * -1);
            }
            chances = bait_3.chances;
            usedBait = bait_3.name;
        } else {
            await addCoins(guildId, userId, baits.default.price * -1)
            usedBait = baits.default.name;
            chances = baits.default.chances;
        }

        const d = Math.random();
        if (d < chances.common) types = commons;
        else if (d < chances.common + chances.uncommon) types = uncommons;
        else if (d < chances.common + chances.uncommon + chances.rare) types = rares;
        else if (d < chances.common + chances.uncommon + chances.rare + chances.garbage) types = garbage;
        const type = Object.keys(types)
        const random = type[Math.floor(Math.random() * type.length)];
        const t = types[random];
        const length = Math.floor(Math.random() * (t.maxLength - t.minLength + 1) + t.minLength);
        let save;
        if (types === commons) {
            save = await findCommon(userId, random);
            await addCommon(userId, random, commons[random].emoji, 1, length);
        }
        if (types === uncommons) {
            save = await findUncommon(userId, random);
            await addUncommon(userId, random, uncommons[random].emoji, 1, length);
        }
        if (types === rares) {
            save = await findRare(userId, random);
            await addRare(userId, random, rares[random].emoji, 1, length);
        }
        if (types === garbage) {
            save = await findGarbage(userId, random);
            await addGarbage(userId, random, garbage[random].emoji, 1);
        }
        await addBagSize(userId, 1);
        let description; let price = 0;
        if ((types === commons) || (types === uncommons) || (types === rares)) {
            const midLength = (t.minLength + t.maxLength) / 2;
            if (length < midLength) {
                emoji = bronze; price = t.minPrice;
            } else if ((length >= midLength) && (length < t.maxLength)) {
                emoji = silver; price = (t.maxPrice + t.minPrice) / 2;
            } else if (length == t.maxLength) {
                emoji = gold; price = t.maxPrice;
            }
            description = 'Du hast gefangen: **' + emoji + ' ' + random + '**\n';
        } else {
            description = 'Du hast gefangen: **' + random + '**\n';
        }
        if (skipBait) {
            description = description + '\n⭐ **Keinen Köder verbraucht!**';
        }
        if (save) {
            if (save.length) {
                if ((save.length < length) && (length < t.maxLength)) {
                    description = description + `\n⭐ **Neue Länge: ${length}cm!**`;
                } else if (length == t.maxLength) {
                    description = description + `\n⭐ **Größtes Exemplar dieser Art!**`;
                    if (save.length < length) {
                        description = description + `\n⭐ **Neue Länge: ${length}cm!**`;
                    }
                }
            }
        } else {
            if (types == garbage) {
                description = description + `\n⭐ **Erster Fang!**`;
            } else {
                if (length === t.maxLength) {
                    description = description + `\n⭐ **Größtes Exemplar dieser Art!**`
                }
                description = description + `\n⭐ **Erster Fang!**\n⭐ **Neue Länge: ${length}cm!**`;
            }
        }
        await addBagValue(userId, price);
        const embed = new MessageEmbed()
            .setTitle('Fishing result')
            .setDescription(description)
            .addFields(
                { name: 'Wert', value: price + ' 💵', inline: true }
            )
            .setColor('#2773fc')
            .setThumbnail(t.image);
        if((types === commons) || (types === uncommons) || (types === rares))  {
            embed.addField('Länge', length + 'cm', true);
        }
        embed.addField('Köder', usedBait, true);
        return embed;
    },
}