const { Collection, MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js');
const { bags, fish, rods, baits } = require('./fish.json');
const { bait_1, bait_2, bait_3 } = baits;
const { gold, silver, bronze } = require('../../emoji.json');
const { commons, uncommons, rares, garbage } = fish;
const { findCommon, findUncommon, findRare, findGarbage, addCommon, addUncommon, addRare, addGarbage, addBagSize, addBagValue, setBag, activeBait, getStats, getCommonStats, getUncommonStats, getRareStats, getGarbageStats, getAllStats } = require('../../features/fishing');
const profile = require('../../models/profile');
const { addCoins, getCoins } = require('../../features/economy');

const cooldowns = new Collection();

module.exports = {
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
    callback: async ({ client, interaction }) => {
        const args = interaction.options.get('options');
        const user = interaction.member.user;
        const p_save = await profile.findOne({ userId: user.id });
        const targetCoins = await getCoins(user.id);
        if (args?.value == 'bait') {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomID('selectBait')
                        .setPlaceholder('Noch nichts ausgewählt')
                        .addOptions([
                            {
                                label: 'Standardköder - 10 💵',
                                description: 'Ein solider Köder für alles',
                                value: 'first_option',
                            },
                            {
                                label: `${bait_1.name} - ${bait_1.price} 💵`,
                                description: bait_1.description,
                                value: 'second_option',
                            },
                            {
                                label: `${bait_2.name} - ${bait_2.price} 💵`,
                                description: bait_2.description,
                                value: 'third_option',
                            },
                            {
                                label: `${bait_3.name} - ${bait_3.price} 💵`,
                                description: bait_3.description,
                                value: 'fourth_option',
                            },
                        ]),
                );
            await interaction.reply({ content: 'Wähle einen Köder aus!', components: [row] });
            
            const message = await interaction.fetchReply();

            const collector = message.createMessageComponentInteractionCollector(i => i.customID === 'selectBait' && i.user.id == user.id, { time: 300000 });
            
            collector.on('collect', async select => {
                if (select.values[0] == 'first_option') {
                    await activeBait(user.id, undefined);
                    select.reply({ content: 'Du hast den Standardköder ausgewählt! Genauere Stats findest du im Wiki.', ephemeral: true });
                }
                else if (select.values[0] == 'second_option') {
                    await activeBait(user.id, 'bait_1');
                    select.reply({ content: `Du hast den ${bait_1.name}köder ausgewählt! Genauere Stats findest du im Wiki.`, ephemeral: true })
                }
                else if (select.values[0] == 'third_option') {
                    await activeBait(user.id, 'bait_2');
                    select.reply({ content: `Du hast den ${bait_2.name}köder ausgewählt! Genauere Stats findest du im Wiki.`, ephemeral: true })
                }
                else if (select.values[0] == 'fourth_option') {
                    await activeBait(user.id, 'bait_3');
                    select.reply({ content: `Du hast den ${bait_3.name}nköder ausgewählt! Genauere Stats findest du im Wiki.`, ephemeral: true })
                }
            });

            collector.on('end', (e) => console.log(e));
            return;
        }
        else if (args?.value == 'collection') {
            const stats = await getStats(user.id);
            if (!stats || !stats.length) {
                interaction.reply({ content: 'Du hast noch keine Fische gefangen! Fange jetzt damit an: `/fish`', ephemeral: true });
                return;
            };
            const embed_1 = new MessageEmbed()
                .setTitle('Fishing collection')
                .setDescription('Dies sind alle Fische die du bereits gefangen hast!')
                .setFooter('Azuma | Seite 1/5', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
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
                .setFooter('Azuma | Seite 2/5', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
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
                .setFooter('Azuma | Seite 3/5', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                .setColor('#2773fc');
            stats.slice(24, 36).map(stat => {
                let value = stat.amount + ' Stück';
                if (stat.length) {
                    value = value + '\nLängster Fang: ' + stat.length + 'cm';
                }
                embed_3.addField(stat.emoji + ' ' + stat.name, value, true)
            })
            const embed_4 = new MessageEmbed()
                .setTitle('Fishing collection')
                .setDescription('Dies sind alle Fische die du bereits gefangen hast!')
                .setFooter('Azuma | Seite 4/5', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                .setColor('#2773fc');
            stats.slice(36, 48).map(stat => {
                let value = stat.amount + ' Stück';
                if (stat.length) {
                    value = value + '\nLängster Fang: ' + stat.length + 'cm';
                }
                embed_4.addField(stat.emoji + ' ' + stat.name, value, true)
            })
            const embed_5 = new MessageEmbed()
                .setTitle('Fishing collection')
                .setDescription('Dies sind alle Fische die du bereits gefangen hast!')
                .setFooter('Azuma | Seite 5/5', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                .setColor('#2773fc');
            stats.slice(48, 60).map(stat => {
                let value = stat.amount + ' Stück';
                if (stat.length) {
                    value = value + '\nLängster Fang: ' + stat.length + 'cm';
                }
                embed_5.addField(stat.emoji + ' ' + stat.name, value, true)
            })
            if (stats.length > 12) {
                const button_back = {
                    type: 2,
                    style: 2,
                    custom_id: 'back',
                    label: '<<',
                };
    
                const button_next = {
                    type: 2,
                    style: 2,
                    custom_id: 'next',
                    label: '>>'
                };

                const row = {
                    type: 1,
                    components: [button_back, button_next],
                };

                const allEmbeds = [ embed_1, embed_2, embed_3, embed_4, embed_5 ];

                interaction.reply({ embeds: [allEmbeds[0]], components: [row] });

                const message = await interaction.fetchReply()
                const filter = i => i.user.id == user.id;

                const collector = message.createMessageComponentInteractionCollector({ filter, time: 300000 });
            
                let currentPage = 0;
            
                collector.on('collect', button => {
                    if (button.user.id == user.id) {
                        if (button.customID == "back") {
                            if (currentPage !== 0) {
                                --currentPage;
                                button.update({embeds:[allEmbeds[currentPage]], components: [row]});
                            } else {
                                currentPage = embeds.length - 1
                                button.update({embeds:[allEmbeds[currentPage]], components: [row]});
                            };
                        }
    
                        else if (button.customID == "next"){
                            if (currentPage < allEmbeds.length - 1) {
                                currentPage++;
                                button.update({embeds:[allEmbeds[currentPage]], components: [row]});
                            } else {
                                currentPage = 0
                                button.update({embeds:[allEmbeds[currentPage]], components: [row]});
                            };
                        };
                    };
                });
                collector.on('end', collected => {
                    button_back.disabled = true;
                    button_next.disabled = true;
                    interaction.editReply({ embeds: [allEmbeds[0]], components: [row] })
                });
                collector.on("error", (e) => console.log(e))
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
                interaction.reply({ embeds: [ embed ]});
                return;
                }
                else {
                    interaction.reply({ content: 'Du hast noch keine Fische gefangen! Fange jetzt damit an: `/fish`', ephemeral: true });
                    return;
                }
            }
            return;
        }
        else if (args?.value == 'sell') {
            if (!p_save || !p_save.bag_size || !p_save.bag_value) {
                interaction.reply({ content: 'Du hast aktuell keine Fische zum verkaufen!', ephemeral: true });
                return;
            }
            await profile.findOneAndUpdate(
                { 
                    userId: user.id 
                },
                { 
                    userId: user.id,
                    bag_size: 0,
                    bag_value: 0,
                }
            );
            await addCoins(user.id, p_save.bag_value);
            interaction.reply({ content: `Du hast ${p_save.bag_size || 0} Fische verkauft und \`${p_save.bag_value || 0}\` 💵 verdient.`, ephemeral: true });
            return;
        }
        else if (args?.value == 'stats') {
            let cAmount = 0; let uAmount = 0; let rAmount = 0; let gAmount = 0;
            for (c of await getCommonStats(user.id)) {
                cAmount = cAmount + c.amount;
            }
            for (u of await getUncommonStats(user.id)) {
                uAmount = uAmount + u.amount;
            }
            for (r of await getRareStats(user.id)) {
                rAmount = rAmount + r.amount;
            }
            for (g of await getGarbageStats(user.id)) {
                gAmount = gAmount + g.amount;
            }
            let length; let amount;
            for (stats of await getAllStats(user.id)) {
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
                .setFooter('Azuma | Contact @florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                .setColor('#2773fc');
            interaction.reply({ embeds: [ embed ]});
            return;
        }
        else if (args?.value == 'rares') {
            const rares = await findRare(user.id);
            const embed = new MessageEmbed()
                .setTitle('Fishing stats')
                .setDescription('Das sind alle Rares, die du bereits gefangen hast!')
                .setColor('#2773fc');
            rares.map(rare => {
                embed.addField(rare.emoji + ' ' + rare.name, rare.amount + ' Stück\nLängster Fang: ' + rare.length + 'cm')
            })
            interaction.reply({ embeds: [ embed ]});
            return;
        }
        else if (args?.value == 'wiki') {
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
                .setFooter('Azuma | Tippe "exit" um das Wiki zu schließen.', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                .setColor('#2773fc');
            interaction.reply({ embeds: [embed] });
            main();
            return;
            function main() {
                const filter = m => m.author.id === user.id;
                interaction.channel.awaitMessages({ filter, max: 1, time: 300000, errors: ['time'] })
                    .then(msg => {
                        msg = msg.first()
                        msg.delete();
                        switch(msg.content) {
                            case '1':
                                handleSearch()
                                break;
                            case '2':
                                handleCommons()
                                break;
                            case '3':
                                handleUncommons()
                                break;
                            case '4':
                                handleRares()
                                break;
                            case '5':
                                handleGarbage()
                                break;
                            case '6':
                                handleRods()
                                break;
                            case '7':
                                handleBags()
                                break;
                            case '8':
                                handleBaits()
                                break;
                            case 'exit':
                                interaction.deleteReply();
                                break;
                            default:
                                interaction.followUp(`<@${user.id}>, es wurde keine gültige Eingabe erkannt, versuche es nochmal!`);
                                main();
                                break;
                        }
                    })
                    .catch(() => {
                        interaction.followUp(`<@${user.id}>, das Wiki wurde aufgrund eines Errors (evtl. Inaktivität) geschlossen.`)
                        return;
                    });
            }
            function handleReturn() {
                const filter = m => m.author.id === user.id
                interaction.channel.awaitMessages({ filter, max: 1, time: 120000, errors: ['time'] })
                    .then(async msg => {
                        msg = msg.first()
                        if (msg.content !== 'return') return
                        msg.delete();
                        interaction.editReply({ embeds: [embed] });
                        main()
                    })
                    .catch((e) => {
                        console.log(e)
                        return;
                    });
            }
            function handleSearch() {
                interaction.channel.send('Coming soon!').then(msg => client.setTimeout(() => msg.delete(), 5000));
                main();
            }
            function handleCommons() {
                const embed = new MessageEmbed()
                    .setTitle('Fishing Wiki: Commons')
                    .setDescription('Das sind alle gewöhnlichen Fische!')
                    .setFooter('Azuma | Tippe "return" um in das Hauptmenü zurückzukehren.', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                    .setColor('#2773fc')
                Object.values(commons).map(fish => {
                    embed.addField(fish.emoji + ' ' + fish.name, 'Länge: ' + fish.minLength + '-' + fish.maxLength + 'cm\nWert: ' + fish.minPrice + '-' + fish.maxPrice + ' 💵', true)
                })
                interaction.editReply({embeds: [embed]});
                handleReturn();
            }
            function handleUncommons() {
                const embed = new MessageEmbed()
                    .setTitle('Fishing Wiki: Uncommons')
                    .setDescription('Das sind alle ungewöhnlichen Fische!')
                    .setFooter('Azuma | Tippe "return" um in das Hauptmenü zurückzukehren.', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                    .setColor('#2773fc')
                Object.values(uncommons).map(fish => {
                    embed.addField(fish.emoji + ' ' + fish.name, 'Länge: ' + fish.minLength + '-' + fish.maxLength + 'cm\nWert: ' + fish.minPrice + '-' + fish.maxPrice + ' 💵', true)
                })
                interaction.editReply({embeds: [embed]});
                handleReturn();
            }
            function handleRares() {
                const embed = new MessageEmbed()
                    .setTitle('Fishing Wiki: Rares')
                    .setDescription('Das sind alle seltenen Fische!')
                    .setFooter('Azuma | Tippe "return" um in das Hauptmenü zurückzukehren.', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                    .setColor('#2773fc')
                Object.values(rares).map(fish => {
                    embed.addField(fish.emoji + ' ' + fish.name, 'Länge: ' + fish.minLength + '-' + fish.maxLength + 'cm\nWert: ' + fish.minPrice + '-' + fish.maxPrice + ' 💵', true)
                })
                interaction.editReply({embeds: [embed]});
                handleReturn();
            }
            function handleGarbage() {
                const embed = new MessageEmbed()
                    .setTitle('Fishing Wiki: Garbage')
                    .setDescription('Das sind die verschiedenen Müllarten!')
                    .setFooter('Azuma | Tippe "return" um in das Hauptmenü zurückzukehren.', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                    .setColor('#2773fc')
                Object.values(garbage).map(fish => {
                    embed.addField(fish.emoji + ' ' + fish.name, 'Wert: 0 💵', true)
                })
                interaction.editReply({embeds: [embed]});
                handleReturn();
            }
            function handleRods() {
                const embed = new MessageEmbed()
                    .setTitle('Fishing Wiki: Angeln')
                    .setDescription('Das sind alle verschiedenen Angeln!')
                    .setFooter('Azuma | Tippe "return" um in das Hauptmenü zurückzukehren.', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                    .setColor('#2773fc')
                Object.values(rods).map(rod => {
                    embed.addField(rod.name, 'Chance keinen Köder zu verbrauchen: ' + (rod.no_bait * 100) + '%\nAngel-Cooldown: ' + rod.cooldown + ' Sekunden\nPreis: ' + rod.price + ' 💵')
                })
                interaction.editReply({embeds: [embed]});
                handleReturn();
            }
            function handleBags() {
                const embed = new MessageEmbed()
                    .setTitle('Fishing Wiki: Rucksäcke')
                    .setDescription('Das sind alle verschiedenen Rucksäcke!')
                    .setFooter('Azuma | Tippe "return" um in das Hauptmenü zurückzukehren.', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                    .setColor('#2773fc')
                Object.values(bags).map(bag => {
                    embed.addField(bag.name, 'Stauraum: ' + bag.size + ' Plätze\nPreis: ' + bag.price + ' 💵')
                })
                interaction.editReply({embeds: [embed]});
                handleReturn();
            }
            function handleBaits() {
                const embed = new MessageEmbed()
                    .setTitle('Fishing Wiki: Köder')
                    .setDescription('Das sind alle verschiedenen Köder!')
                    .setFooter('Azuma | Tippe "return" um in das Hauptmenü zurückzukehren.', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                    .setColor('#2773fc')
                Object.values(baits).map(bait => {
                    embed.addField(bait.name, bait.description + `\n- Chances:\n${commons.Sardelle.emoji} Commons: ${(bait.chances.common * 100).toFixed(2)}%\n${uncommons.Regenbogenforelle.emoji} Uncommons: ${(bait.chances.uncommon * 100).toFixed(2)}%\n${rares.Purpurfisch.emoji} Rares: ${(bait.chances.rare * 100).toFixed(2)}%\n${garbage.Grünalge.emoji} Garbage: ${(bait.chances.garbage * 100).toFixed(2)}%\n- Preis: ` + bait.price + ' 💵')
                })
                interaction.editReply({embeds: [embed]});
                handleReturn();
            }
        };
        if ((!p_save) || (!p_save.rod)) {
            interaction.reply({ content: 'Du brauchst eine Angel um zu Fischen! Kaufe eine im Shop!', ephemeral: true });
            return;
        };
        if (targetCoins < baits[p_save.active_bait || 'default'].price) {
            interaction.reply({ content: 'Du hast nicht genügend Credits um zu Fischen!', ephemeral: true });
            return;
        };
        if (!p_save.bag) {
            await setBag(user.id, 'bag_1');
        } 
        else {
            const userBag = bags[p_save.bag]
            if (userBag.size <= p_save.bag_size) {
                const sellButton = new MessageButton()
                    .setLabel('Fische verkaufen')
                    .setStyle('SUCCESS')
                    .setCustomID('sell');
                const row = {
                    type: 1,
                    components: [sellButton],
                }
                interaction.reply({ content: `Dein Rucksack ist voll! Verkaufe Fische oder kaufe einen größeren Rucksack im Shop.`, components: [row], ephemeral: true });
                interaction.channel.awaitMessageComponentInteraction(i => i.user.id == user.id, { time: 300000 })
                    .then(async button => {
                        if (button.customID == 'sell') {
                            sellButton.setDisabled(true);
                            await profile.findOneAndUpdate(
                                { 
                                    userId: user.id 
                                },
                                { 
                                    userId: user.id,
                                    bag_size: 0,
                                    bag_value: 0,
                                }
                            );
                            await addCoins(user.id, p_save.bag_value);
                            button.update({ components: [row] });
                            interaction.followUp({ content: `Du hast ${p_save.bag_size || 0} Fische verkauft und \`${p_save.bag_value || 0}\` 💵 verdient.`, ephemeral: true });
                        };
                    })
                    .catch(() => {
                        sellButton.setDisabled(true);
                        sellButton.setLabel('Zeit abgelaufen1!');
                        sellButton.setStyle('DANGER');
                        interaction.editReply({ components: [row] });
                    });
                return;
            };
        };

        if (!cooldowns.has('fish')) cooldowns.set('fish', new Collection());
		const now = Date.now();
		const timestamps = cooldowns.get('fish');
		const cooldownAmount = (rods[p_save.rod].cooldown || 30) * 1000;
		if (timestamps.has(user.id)) {
			const expirationTime = timestamps.get(user.id) + cooldownAmount;
			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
                interaction.reply({ content: `Du kannst in ${timeLeft.toFixed(0)} Sekunden wieder fischen.`, ephemeral: true });
				return;
			}
		}
		timestamps.set(user.id, now);
		setTimeout(() => timestamps.delete(user.id), cooldownAmount);

        const userRod = rods[p_save.rod];
        const randomNumber = Math.random();
        let types; let emoji; let usedBait; let skipBait
        if (p_save.active_bait == 'bait_1') {
            if (randomNumber < userRod.no_bait) {
                skipBait = true;
            }
            else {
                await addCoins(user.id, bait_1.price * -1);
            }
            chances = bait_1.chances;
            usedBait = bait_1.name;
        }
        else if (p_save.active_bait == 'bait_2') {
            if (randomNumber < userRod.no_bait) {
                skipBait = true;
            }
            else {
                await addCoins(user.id, bait_2.price * -1);
            }
            chances = bait_2.chances;
            usedBait = bait_2.name;
        }
        else if (p_save.active_bait == 'bait_3') {
            if (randomNumber < userRod.no_bait) {
                skipBait = true;
            }
            else {
                await addCoins(user.id, bait_3.price * -1);
            }
            chances = bait_3.chances;
            usedBait = bait_3.name;
        }
        else {
            await addCoins(user.id, baits.default.price * -1)
            usedBait = baits.default.name;
            chances = baits.default.chances;
        };

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
            save = await findCommon(user.id, random);
            await addCommon(user.id, random, commons[random].emoji, 1, length);
        }
        else if (types === uncommons) {
            save = await findUncommon(user.id, random);
            await addUncommon(user.id, random, uncommons[random].emoji, 1, length);
        }
        else if (types === rares) {
            save = await findRare(user.id, random);
            await addRare(user.id, random, rares[random].emoji, 1, length);
        }
        else if (types === garbage) {
            save = await findGarbage(user.id, random);
            await addGarbage(user.id, random, garbage[random].emoji, 1);
        };
        await addBagSize(user.id, 1);
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
        }
        else {
            description = 'Du hast gefangen: **' + random + '**\n';
        };
        if (skipBait) {
            description = description + '\n⭐ **Keinen Köder verbraucht!**';
        };
        if (save) {
            if (save.length) {
                if ((save.length < length) && (length < t.maxLength)) {
                    description = description + `\n⭐ **Neue Länge: ${length}cm!**`;
                }
                else if (length == t.maxLength) {
                    description = description + `\n⭐ **Größtes Exemplar dieser Art!**`;
                    if (save.length < length) {
                        description = description + `\n⭐ **Neue Länge: ${length}cm!**`;
                    };
                };
            };
        }
        else {
            if (types == garbage) {
                description = description + `\n⭐ **Erster Fang!**`;
            }
            else {
                if (length === t.maxLength) {
                    description = description + `\n⭐ **Größtes Exemplar dieser Art!**`
                };
                description = description + `\n⭐ **Erster Fang!**\n⭐ **Neue Länge: ${length}cm!**`;
            };
        };
        await addBagValue(user.id, price);
        const embed = new MessageEmbed()
            .setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`)
            .setDescription(description)
            .addFields(
                { name: 'Wert', value: price + ' 💵', inline: true }
            )
            .setColor('#2773fc')
            .setFooter('Azuma | Contact @florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
            .setThumbnail(t.image);
        if((types === commons) || (types === uncommons) || (types === rares))  {
            embed.addField('Länge', length + 'cm', true);
        };
        embed.addField('Köder', usedBait, true);
        interaction.reply({ embeds: [ embed ] }).catch(e => console.log(e));
    },
}