const { Collection, MessageEmbed } = require('discord.js');
const { fish, rods, baits } = require('./fish.json');
const { yes, no, gold, silver, bronze } = require('../../emoji.json');
const { commons, uncommons, rares, garbage } = fish;
const { findCommon, findUncommon, findRare, findGarbage, addCommon, addUncommon, addRare, addGarbage, addBagSize, addBagValue, setBag, useBait_1, useBait_2, useBait_3, activeBait, getStats, getCommonStats, getUncommonStats, getRareStats, getGarbageStats } = require('../../features/fishing');
const profile = require('../../models/profile');
const { addCoins, getCoins } = require('../../features/economy');

const cooldowns = new Collection();

module.exports = {
    slash: true,
    ownerOnly: true,
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
                { name: 'bait', value: 'bait' }
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
        if (args.options == 'collection') {
            const stats = await getStats(userId);
            if (!stats || !stats.length) {
                return no + ' Du hast noch keine Fische gefangen! Fange jetzt damit an: `/fish`';
            }
            const embed_1 = new MessageEmbed()
                .setTitle('Fishing collection')
                .setDescription('Dies sind alle Fische die du bereits gefangen hast!')
                .setColor('#2773fc');
            stats.slice(0, 15).map(stat => {
                let value = stat.amount + ' Stück';
                if (stat.length) {
                    value = value + '\nLängster Fang: ' + stat.length + 'cm';
                }
                embed_1.addField(stat.emoji + ' ' + stat.name, value, true)
            })
            const embed_2 = new MessageEmbed()
                .setTitle('Fishing collection')
                .setDescription('Dies sind alle Fische die du bereits gefangen hast!')
                .setColor('#2773fc');
            stats.slice(16, 31).map(stat => {
                let value = stat.amount + ' Stück';
                if (stat.length) {
                    value = value + '\nLängster Fang: ' + stat.length + 'cm';
                }
                embed_2.addField(stat.emoji + ' ' + stat.name, value, true)
            })
            if (stats.length > 16) {
                start()
            } else {
                if (stats.length > 0) {
                    return embed_1;
                } else {
                    return 'Du hast noch keine Fische gefangen! Fange jetzt damit an: `/fish`';
                }
            }

            function start () {
                channel.send(embed_1).then(msg => {
                    this.msg = msg;
                    addReactions()
                    awaitReactions()
                })
            }
            function setPage (emojiName) {
                if (emojiName === '➡') {
                    this.msg.edit(embed_2)
                } else if (emojiName === '⬅') {
                    this.msg.edit(embed_1)
                }

                this.reactionCollector.stop()
                addReactions()
                awaitReactions()
            }
            function addReactions () {
                this.msg.react('⬅')
                this.msg.react('➡')
            }
            function clearReactions () {
                if (this.msg) {
                    this.msg.reactions.removeAll()
                }
            }
            function awaitReactions () {
                this.reactionCollector = this.msg.createReactionCollector((reaction, user) => user.id !== this.msg.client.user.id, { idle: 5000 })
                
                this.reactionCollector.on('end', (reactions) => {
                    return reactions.array().length > 0 ? reactions.array()[0].users.remove(this.msg.client.users.cache.get(userId)) : clearReactions();
                })

                reactionCollector.on('collect', (reaction, user) => {
                    if (user.id !== userId) {
                        return reaction.users.remove(user)
                    }
                    if (reaction.emoji.name == '➡') {
                        setPage('➡')
                    } else if (reaction.emoji.name == '⬅') {
                        setPage('⬅')
                    }
                })
            }
            return 'Lade Fishing collection...';
        } else if (args.options == 'sell') {
            if (!p_save || !p_save.bag_size || !p_save.bag_value) {
                return no + ' Du hast aktuell keine Fische zum verkaufen!'
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
            const embed = new MessageEmbed()
                .setTitle('Fishing stats')
                .setDescription('Für genauere Stats zu den einzelnen Fischen\nbenutze `/fish collection`.')
                .addField('Stats', `${commons.Sardelle.emoji} Commons: ${cAmount} Stück\n${uncommons.Regenbogenforelle.emoji} Uncommons: ${uAmount} Stück\n${rares.Purpurfisch.emoji} Rares: ${rAmount} Stück\n${garbage.Grünalge.emoji} Garbage: ${gAmount} Stück`)
                .setColor('#2773fc');
            return embed;
        } else if (args.options == 'bait') {
            const embed = new MessageEmbed()
                .setTitle('Wähle einen aktiven Köder aus!')
                .setDescription(`
:one: ${p_save.bait_1 || 0}x ${baits.bait_1.name}

:two: ${p_save.bait_2 || 0}x ${baits.bait_2.name}

:three: ${p_save.bait_3 || 0}x ${baits.bait_3.name}

:four: Ohne Köder weiterfischen
                `)
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
                        msg = msg.first();
                        m.delete(); msg.delete();
                        if (msg.content == '1') {
                            await activeBait(userId, 'bait_1');
                            channel.send(yes + ` Du fischt nun mit dem Köder ${baits.bait_1.name}!`);
                        }
                        else if (msg.content == '2') {
                            await activeBait(userId, 'bait_2');
                            channel.send(yes + ` Du fischt nun mit dem Köder ${baits.bait_2.name}!`);
                        }
                        else if (msg.content == '3') {
                            await activeBait(userId, 'bait_3');
                            channel.send(yes + ` Du fischt nun mit dem Köder ${baits.bait_3.name}!`);
                        }
                        else if (msg.content == '4') {
                            await activeBait(userId, undefined);
                            channel.send(yes + ' Du fischt jetzt ohne Köder!');
                        }
                    })
                    .catch(() => {
                        channel.send(no + ' Die Köderauswahl wurde aufgrund von Inaktivität geschlossen.')
                    })
                })
            }, 500);
            return 'Wähle einen aktiven Köder...';
        }
        if ((!p_save) || (!p_save.rod)) {
            return no + ' Du brauchst eine Angel um zu Fischen! Kaufe eine im Shop!';
        }
        if (targetCoins < 5) {
            return no + ' Du hast nicht genügend Credits um zu Fischen!';
        }
        if (!p_save.bag) {
            await setBag(userId, 'bag_1');
        }

        if (!cooldowns.has('fish')) cooldowns.set('fish', new Collection());
		const now = Date.now();
		const timestamps = cooldowns.get('fish');
		const cooldownAmount = (rods[p_save.rod].cooldown || 30) * 1000;
		if (timestamps.has(userId)) {
			const expirationTime = timestamps.get(userId) + cooldownAmount;
			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return no + ` Du kannst in ${timeLeft.toFixed(0)} Sekunden wieder fischen.`;
			}
		}
		timestamps.set(userId, now);
		setTimeout(() => timestamps.delete(userId), cooldownAmount);

        const userRod = rods[p_save.rod];
        const randomNumber = Math.random();
        let types; let emoji; let usedBait; let chances; let remaining; let skipBait
        if (p_save.active_bait == 'bait_1') {
            if (!p_save.bait_1 || p_save.bait_1 == 0) {
                return no + ` Du hast den Köder ${baits.bait_1.name} nicht mehr! Kaufe neue oder wähle einen anderen Köder aus!`;
            }
            if (randomNumber > userRod.no_bait) {
                await useBait_1(userId, p_save.bait_1);
                skipBait = true;
            }
            chances = baits.bait_1.chances;
            usedBait = baits.bait_1.name;
            remaining = p_save.bait_1 - 1;
        } else if (p_save.active_bait == 'bait_2') {
            if (!p_save.bait_1 || p_save.bait_1 == 0) {
                return no + ` Du hast den Köder ${baits.bait_2.name} nicht mehr! Kaufe neue oder wähle einen anderen Köder aus!`;
            }
            if (randomNumber > userRod.no_bait) {
                await useBait_2(userId, p_save.bait_2);
                skipBait = true;
            }
            chances = baits.bait_2.chances;
            usedBait = baits.bait_2.name;
            remaining = p_save.bait_2 - 1;
        } else if (p_save.active_bait == 'bait_3') {
            if (!p_save.bait_1 || p_save.bait_1 == 0) {
                return no + ` Du hast den Köder ${baits.bait_3.name} nicht mehr! Kaufe neue oder wähle einen anderen Köder aus!`;
            }
            if (randomNumber > userRod.no_bait) {
                await useBait_3(userId, p_save.bait_3);
                skipBait = true;
            }
            chances = baits.bait_3.chances;
            usedBait = baits.bait_3.name;
            remaining = p_save.bait_3 - 1;
        } else {
            chances = {
                common: 0.5,
                uncommon: 0.3485,
                rare: 0.0015,
                garbage: 0.15
            }
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
        await addCoins(guildId, userId, -5);
        await addBagSize(userId, 1);
        let description; let price = 0;
        if ((types === commons) || (types === uncommons) || (types === rares)) {
            const midLength = (t.minLength + t.maxLength) / 2;
            if (length < midLength) {
                emoji = bronze; price = t.minPrice;
            } else if ((length >= midLength) && (length < t.maxLength)) {
                emoji = silver; price = (t.maxPrice + t.minPrice) / 2;
            } else if (length == t.maxLength) {
                emoji = gold;
            }
            description = 'Du hast gefangen: **' + emoji + ' ' + random + '**\n';
        } else {
            description = 'Du hast gefangen: **' + random + '**\n';
        }
        if (usedBait) {
            description = description + `${remaining} Köder verleibend.\n`;
        }
        if (skipBait) {
            description = description + '\n⭐ **Keinen Köder verbraucht!**';
        }
        if (save) {
            if (save.length) {
                if ((save.length < length) && (length < t.maxLength)) {
                    description = description + `\n⭐ **Neue Länge: ${length}cm!**`;
                } else if (length == t.maxLength) {
                    description + `\n⭐ **Größtes Exemplar dieser Art!**\n⭐ **Neue Länge: ${length}cm!**`;
                }
            }
        } else {
            if (types == garbage) {
                description = description + `\n⭐ **Erster Fang!**`;
            } else {
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
        if (usedBait) {
            embed.addField('Köder', usedBait, true);
        }
        return embed;
    },
}