const { MessageEmbed } = require("discord.js");
const economy = require('../../features/economy');

module.exports = {
    callback: async ({ client, interaction }) => {
        const user = interaction.member.user;
        const userID = user.id;
        const bet = interaction.options.get('credits').value;
        let credits = interaction.options.get('credits').value;
        let userCredits = await economy.getCoins(userID);
        if (userCredits < credits) {
            interaction.reply({ content: 'Du hast für diesen Einsatz nicht genug Credits!', ephemeral: true });
            return;
        }
        else if (credits < 50) {
            interaction.reply({ content: 'Es werden nur Einsätze in der Höhe von 50 Credits oder höher akzeptiert!', ephemeral: true });
            return;
        };

        const cards = [
            { name: '2', value: 2 }, { name: '2', value: 2 }, { name: '2', value: 2 }, { name: '2', value: 2 }, 
            { name: '3', value: 3 }, { name: '3', value: 3 }, { name: '3', value: 3 }, { name: '3', value: 3 }, 
            { name: '4', value: 4 }, { name: '4', value: 4 }, { name: '4', value: 4 }, { name: '4', value: 4 }, 
            { name: '5', value: 5 }, { name: '5', value: 5 }, { name: '5', value: 5 }, { name: '5', value: 5 }, 
            { name: '6', value: 6 }, { name: '6', value: 6 }, { name: '6', value: 6 }, { name: '6', value: 6 }, 
            { name: '7', value: 7 }, { name: '7', value: 7 }, { name: '7', value: 7 }, { name: '7', value: 7 }, 
            { name: '8', value: 8 }, { name: '8', value: 8 }, { name: '8', value: 8 }, { name: '8', value: 8 }, 
            { name: '9', value: 9 }, { name: '9', value: 9 }, { name: '9', value: 9 }, { name: '9', value: 9 }, 
            { name: '10', value: 10 }, { name: '10', value: 10 }, { name: '10', value: 10 }, { name: '10', value: 10 }, 
            { name: 'J', value: 10 }, { name: 'J', value: 10 }, { name: 'J', value: 10 }, { name: 'J', value: 10 }, 
            { name: 'Q', value: 10 }, { name: 'Q', value: 10 }, { name: 'Q', value: 10 }, { name: 'Q', value: 10 }, 
            { name: 'K', value: 10 }, { name: 'K', value: 10 }, { name: 'K', value: 10 }, { name: 'K', value: 10 }, 
            { name: 'A', value: 11 }, { name: 'A', value: 11 }, { name: 'A', value: 11 }, { name: 'A', value: 11 }, 
        ];

        function randomCard() {
            const card = cards[Math.floor(Math.random()*cards.length)];
            for (i = 0; i < cards.length; i++) {
                if (cards[i] == card) {
                    cards.splice(i, 1);
                };
            };
            return card;
        };

        // Player Cards
        let pSoft;
        const pCard1 = randomCard();
        if (pCard1.value == 11) {
            pSoft = true;
        };
        const pCard2 = randomCard();
        if ((pCard1.value && pCard2.value) == 11) {
            pCard2.value = 1
        };
        const playerCards = [];
        playerCards.push(pCard1.name);
        playerCards.push(' ' + pCard2.name);
        let playerSum = pCard1.value + pCard2.value;

        // Split Pot
        let split;
        let pSoft1; let pSoft2;
        let card1_finished; let card2_finished;
        const playerCards1 = []; const playerCards2 = [];
        if (pCard1.value == 11) {
            pSoft1 = true; pSoft2 = true;
        };
        playerCards1.push(pCard1.name);
        playerCards2.push(' ' + pCard2.name);
        let playerSum1 = pCard1.value;
        let playerSum2 = pCard2.value;

        // Dealer Cards
        let dSoft;
        const dCard1 = randomCard();
        if (dCard1.value == 11) {
            dSoft = true;
        };
        const dCard2 = randomCard();
        if ((dCard1.value & dCard2.value == 11)) {
            pCard2.value = 1;
        };
        const dealerCards = [];
        dealerCards.push(dCard1.name);
        dealerCards.push(' ' + dCard2.name);
        let dealerSum = dCard1.value + dCard2.value;

        const embed = new MessageEmbed()
            .setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userID}/${user.avatar}.webp`)
            .setTitle('Blackjack')
            .addFields(
                { name: 'Deine Hand', value: playerCards + '\nTotal: ' + playerSum, inline: true },
                { name: 'Hand vom Dealer', value: dCard1.name + ', ?\nTotal: ?', inline: true },
                { name: 'Info', value: '**Stand:** Das Spiel beenden\n**Hit:** Eine weitere Karte ziehen\n**Double:** Doppelter Einsatz, eine Karte ziehen und beenden\n**Split:** Teile deinen Pot bei einem Paar\n**Fold:** Aufgeben, aber nur die Hälfte des Einsatzes verlieren'}
            )
            .setFooter('Azuma | Das Spiel läuft nach 5 Minuten Inaktivität ab.', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
            .setColor('5865F2');

        const button_stand = {
            type: 2,
            label: 'Stand',
            style: 3,
            custom_id: 'bjStand',
        };

        const button_hit = {
            type: 2,
            label: 'Hit',
            style: 1,
            custom_id: 'bjHit',
        };

        const button_double = {
            type: 2,
            label: 'Double',
            style: 2,
            custom_id: 'bjDouble',
        };

        const button_double_disabled = {
            type: 2,
            label: 'Double',
            style: 2,
            custom_id: 'bjDouble',
            disabled: true,
        };

        const button_split = {
            type: 2,
            label: 'Split',
            style: 2,
            custom_id: 'bjSplit',
        };

        const button_split_disabled = {
            type: 2,
            label: 'Split',
            style: 2,
            custom_id: 'bjSplit',
            disabled: true,
        };

        const button_fold = {
            type: 2,
            label: 'Fold',
            style: 2,
            custom_id: 'bjFold',
        };

        const button_finished = {
            type: 2,
            label: 'Spiel beendet',
            style: 2,
            custom_id: 'bjFinished',
            disabled: true,
        };

        if (pCard1.name !== pCard2.name) {
            button_split.disabled = true;
        };

        const row = {
            type: 1,
            components: [ button_stand, button_hit, button_double, button_split, button_fold ],
        };

        const row_2 = {
            type: 1,
            components: [ button_stand, button_hit, button_double_disabled, button_split_disabled, button_fold ],
        };

        const row_3 = {
            type: 1,
            components: [ button_stand, button_hit, button_double, button_split_disabled, button_fold ],
        };

        const row_4 = {
            type: 1,
            components: [ button_finished ],
        };

        if (dealerSum == 21) {
            const newBalance = await economy.addCoins(userID, credits * -1);
            const newEmbed = new MessageEmbed()
                .setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userID}/${user.avatar}.webp`)
                .setTitle('Blackjack')
                .setDescription('Der Dealer hat einen Blackjack mit den ersten beiden Karten!')
                .addFields(
                    { name: 'Deine Hand', value: playerCards + '\nTotal: ' + playerSum, inline: true },
                    { name: 'Hand vom Dealer', value: dealerCards + '\nTotal: ' + dealerSum, inline: true },
                    { name: 'Gewinn', value: '-' + credits + ' Credits' },
                    { name: 'Credits', value: 'Du hast jetzt ' + newBalance + ' Credits.' }
                )
                .setFooter('Azuma | Contact florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                .setColor('ED4245');
            interaction.reply({ embeds: [newEmbed], components: [row_4] });
            return;
        };

        interaction.reply({ embeds: [embed], components: [row] });

        while (dealerSum < 17) {
            let newCard = randomCard();
            if ((newCard.value == 11) & (dealerSum > 10)) {
                newCard.value = 1;
            }
            else if ((dealerSum > 21) & dSoft == true) {
                dSoft = false;
                dealerSum = dealerSum - 10;
            };
            dealerCards.push(' ' + newCard.name);
            dealerSum = dealerSum + newCard.value;
        };

        const message = await interaction.fetchReply()
        const filter = i => i.user.id == userID;

        const collector = message.createMessageComponentInteractionCollector({ filter, time: 300000 });

        collector.on('collect', async button => {
            if (button.customID == 'bjStand') {
                if (split) {
                    if (!card1_finished) {
                        card1_finished = true;
                        const newEmbed = new MessageEmbed()
                            .setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userID}/${user.avatar}.webp`)
                            .setTitle('Blackjack')
                            .setDescription('Die zweite Hand ist aktiv.')
                            .addFields(
                                { name: 'Deine 1. Hand', value: playerCards1 + '\nTotal: ' + playerSum1, inline: true },
                                { name: 'Deine 2. Hand', value: playerCards2 + '\nTotal: ' + playerSum2, inline: true },
                                { name: 'Hand vom Dealer', value: dCard1.name + ', ?\nTotal: ?', inline: true },
                                { name: 'Info', value: '**Stand:** Das Spiel beenden\n**Hit:** Eine weitere Karte ziehen\n**Double:** Doppelter Einsatz, eine Karte ziehen und beenden\n**Fold:** Aufgeben, aber nur die Hälfte des Einsatzes verlieren'}
                            )
                            .setFooter('Azuma | Das Spiel läuft nach 5 Minuten Inaktivität ab.', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                            .setColor('5865F2')
                        button.update({ embeds: [newEmbed], components: [row_3]});
                    }
                    else if (card1_finished) {
                        card2_finished == true;
                        const winner1 = await checkWinner(playerSum1, dealerSum)
                        const winner2 = await checkWinner(playerSum2, dealerSum)
                        const newEmbed = new MessageEmbed()
                            .setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userID}/${user.avatar}.webp`)
                            .setTitle('Blackjack')
                            .addFields(
                                { name: 'Deine 1. Hand', value: playerCards1 + '\nTotal: ' + playerSum1, inline: true },
                                { name: 'Deine 2. Hand', value: playerCards2 + '\nTotal: ' + playerSum2, inline: true },
                                { name: 'Hand vom Dealer', value: dealerCards + '\nTotal: ' + dealerSum, inline: true },
                            )
                            .setFooter('Azuma | Contact florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                            .setColor('5865F2')
                        if ((winner1 == 'player') & (winner2 == 'player')) {
                            // 2 Wins
                            credits = credits * 2;
                            newEmbed.setDescription('Beide Hände sind besser als die vom Dealer! Glückwunsch!')
                            newEmbed.setColor('57F287')
                        }
                        else if (((winner1 == 'player') & (winner2 == 'dealer')) || ((winner2 == 'player') & (winner1 == 'dealer'))) {
                            // 1 Win, 1 Loose
                            credits = 0;
                            newEmbed.setDescription('Nur eine Hand ist besser als die vom Dealer!')
                        }
                        else if ((winner1 == 'dealer') & (winner2 == 'dealer')) {
                            // 2 Loses
                            credits = credits * -1;
                            newEmbed.setDescription('Beide Hände sind schlechter als die vom Dealer!')
                            newEmbed.setColor('ED4245')
                        }
                        else if (((winner1 == 'player') & (winner2 == 'draw')) || ((winner2 == 'player') & (winner1 == 'draw'))) {
                            // 1 Win, 1 Draw
                            credits = (credits / 2);
                            newEmbed.setDescription('Nur eine Hand ist besser als die vom Dealer!')
                            newEmbed.setColor('57F287')
                        }
                        else if (((winner1 == 'dealer') & (winner2 == 'draw')) || ((winner2 == 'dealer') & (winner1 == 'draw'))) {
                            // 1 Loose, 1 Draw
                            credits = (credits / 2) * -1;
                            newEmbed.setDescription('Eine Hand ist schlechter und eine ist gleich! Das geht besser!')
                            newEmbed.setColor('ED4245')
                        }
                        else if ((winner1 == 'draw') & (winner2 == 'draw')) {
                            // 2 Draws
                            credits = 0;
                            newEmbed.setDescription('Alle drei Hände sind gleich! Was ein Zufall.')
                        }
                        const newBalance = await economy.addCoins(userID, credits);
                        newEmbed.addFields(
                            { name: 'Gewinn', value: credits + ' Credits' },
                            { name: 'Credits', value: 'Du hast jetzt ' + newBalance + ' Credits.' }
                        )
                        button.update({ embeds: [newEmbed], components: [row_4]});
                        collector.stop();
                    }
                }
                else {
                    const winner = await checkWinner(playerSum, dealerSum)
                    const newEmbed = new MessageEmbed()
                        .setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userID}/${user.avatar}.webp`)
                        .setTitle('Blackjack')
                        .addFields(
                            { name: 'Deine Hand', value: playerCards + '\nTotal: ' + playerSum, inline: true },
                            { name: 'Hand vom Dealer', value: dealerCards + '\nTotal: ' + dealerSum, inline: true },
                        )
                        .setFooter('Azuma | Contact florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                        .setColor('5865F2')
                    if (winner == 'player') {
                        const newBalance = await economy.addCoins(userID, credits);
                        newEmbed.setDescription('Du hast die bessere Hand! Glückwunsch!')
                        newEmbed.addFields(
                            { name: 'Gewinn', value: (credits * 2) + ' Credits' },
                            { name: 'Credits', value: 'Du hast jetzt ' + newBalance + ' Credits.' }
                        )
                        newEmbed.setColor('57F287')
                    }
                    else if (winner == 'dealer') {
                        const newBalance = await economy.addCoins(userID, credits * -1);
                        newEmbed.setDescription('Du hast die schlechtere Hand und verlierst alles!')
                        newEmbed.addFields(
                            { name: 'Gewinn', value: '-' + credits + ' Credits' },
                            { name: 'Credits', value: 'Du hast jetzt ' + newBalance + ' Credits.' }
                        )
                        newEmbed.setColor('ED4245')
                    }
                    else if (winner == 'draw') {
                        newEmbed.setDescription('Du hast gleichviel wie der Dealer! Unentschieden!');
                        newEmbed.addFields(
                            { name: 'Gewinn', value: '0 Credits' },
                            { name: 'Credits', value: 'Du hast jetzt ' + userCredits + ' Credits.' }
                        )
                    }
                    button.update({ embeds: [newEmbed], components: [row_4]});
                    collector.stop();
                }
            }
            else if (button.customID == 'bjHit') {
                if (split) {
                    const newEmbed = new MessageEmbed()
                        .setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userID}/${user.avatar}.webp`)
                        .setTitle('Blackjack')
                        .setFooter('Azuma | Das Spiel läuft nach 5 Minuten Inaktivität ab.', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                        .setColor('5865F2');

                    if (!card1_finished) {
                        let newCard1 = randomCard();
                        if (newCard1.value == 11) {
                            pSoft1 = true;
                        }
                        playerSum1 = playerSum1 + newCard1.value
                        if (playerSum1 > 21) {
                            if (pSoft1) {
                                playerSum1 = playerSum1 - 10;
                                pSoft1 = false;
                            }
                            else {
                                card1_finished = true;
                                newEmbed.setDescription('Die zweite Hand ist aktiv.')
                            };
                        }
                        playerCards1.push(' ' + newCard1.name)
                        newEmbed.setDescription('Die erste Hand ist aktiv.')
                    }
                    else if (!card2_finished) {
                        let newCard2 = randomCard();
                        if (newCard2.value == 11) {
                            pSoft2 = true;
                        };
                        playerSum2 = playerSum2 + newCard2.value;
                        if (playerSum2 > 21 && pSoft2) {
                            if (pSoft2) {
                                playerSum2 = playerSum2 - 10;
                                pSoft2 = false;
                            }
                            else {
                                card2_finished = true;
                            }
                        }
                        playerCards2.push(' ' + newCard2.name)
                        newEmbed.setDescription('Die zweite Hand ist aktiv.')
                    }
                    newEmbed.addFields(
                        { name: 'Deine 1. Hand', value: playerCards1 + '\nTotal: ' + playerSum1, inline: true },
                        { name: 'Deine 2. Hand', value: playerCards2 + '\nTotal: ' + playerSum2, inline: true },
                        { name: 'Hand vom Dealer', value: dCard1.name + ', ?\nTotal: ?', inline: true },
                        { name: 'Info', value: '**Stand:** Das Spiel beenden\n**Hit:** Eine weitere Karte ziehen\n**Double:** Doppelter Einsatz, eine Karte ziehen und beenden\n**Fold:** Aufgeben, aber nur die Hälfte des Einsatzes verlieren'}
                    )

                    if ((playerSum1 & playerSum2) > 21) {
                        const newBalance = await economy.addCoins(userID, credits * -1);
                        const embed_3 = new MessageEmbed()
                            .setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userID}/${user.avatar}.webp`)
                            .setTitle('Blackjack')
                            .setDescription('Beide Hände haben über 21 Augen und du verlierst alles!')
                            .addFields(
                                { name: 'Deine 1. Hand', value: playerCards1 + '\nTotal: ' + playerSum1, inline: true },
                                { name: 'Deine 2. Hand', value: playerCards2 + '\nTotal: ' + playerSum2, inline: true },
                                { name: 'Hand vom Dealer', value: dCard1.name + ', ?\nTotal: ?', inline: true },
                                { name: 'Gewinn', value: '-' + credits + ' Credits' },
                                { name: 'Credits', value: 'Du hast jetzt ' + newBalance + ' Credits.' }
                            )
                            .setFooter('Azuma | Contact florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                            .setColor('ED4245')
                        button.update({ embeds: [embed_3], components: [row_4]});
                        collector.stop();
                    } else {
                        button.update({ embeds: [newEmbed], components: [row_2]});
                    };
                }
                else {
                    let newCard = randomCard();
                    if (newCard.value == 11) {
                        pSoft = true;
                    }
                    playerSum = playerSum + newCard.value;
                    if (playerSum > 21) {
                        if (pSoft) {
                            playerSum = playerSum - 10;
                            pSoft = false;
                        }
                        else {
                            const newBalance = await economy.addCoins(userID, credits * -1);
                            const embed_3 = new MessageEmbed()
                                .setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userID}/${user.avatar}.webp`)
                                .setTitle('Blackjack')
                                .setDescription('Du hast über 21 Augen und verlierst alles!')
                                .addFields(
                                    { name: 'Deine Hand', value: playerCards + '\nTotal: ' + playerSum, inline: true },
                                    { name: 'Hand vom Dealer', value: dCard1.name + ', ?\nTotal: ?', inline: true },
                                    { name: 'Gewinn', value: '-' + credits + ' Credits' },
                                    { name: 'Credits', value: 'Du hast jetzt ' + newBalance + ' Credits.' }
                                )
                                .setFooter('Azuma | Contact florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                                .setColor('ED4245')
                            button.update({ embeds: [embed_3], components: [row_4]});
                            collector.stop();
                            return;    
                        }
                    };
                    playerCards.push(' ' + newCard.name);
                    const newEmbed = new MessageEmbed()
                        .setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userID}/${user.avatar}.webp`)
                        .setTitle('Blackjack')
                        .addFields(
                            { name: 'Deine Hand', value: playerCards + '\nTotal: ' + playerSum, inline: true },
                            { name: 'Hand vom Dealer', value: dCard1.name + ', ?\nTotal: ?', inline: true },
                            { name: 'Info', value: '**Stand:** Das Spiel beenden\n**Hit:** Eine weitere Karte ziehen\n**Double:** Doppelter Einsatz, eine Karte ziehen und beenden\n**Fold:** Aufgeben, aber nur die Hälfte des Einsatzes verlieren'}
                        )
                        .setFooter('Azuma | Das Spiel läuft nach 5 Minuten Inaktivität ab.', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                        .setColor('5865F2');
                    button.update({ embeds: [newEmbed], components: [row_2]});
                }
            }
            else if (button.customID == 'bjDouble') {
                if (split) {
                    credits = credits + bet;
                    const newEmbed = new MessageEmbed()
                        .setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userID}/${user.avatar}.webp`)
                        .setTitle('Blackjack')
                        .setFooter('Azuma | Das Spiel läuft nach 5 Minuten Inaktivität ab.', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                        .setColor('5865F2');

                    if (!card1_finished) {
                        let newCard1 = randomCard();
                        if (newCard1.value == 11) {
                            pSoft1 = true;
                        }
                        playerSum1 = playerSum1 + newCard1.value;
                        if (playerSum1 > 21 && pSoft1) {
                            playerSum1 = playerSum1 - 10;
                            pSoft = false;
                        };
                        playerCards1.push(' ' + newCard1.name)
                        newEmbed.setDescription('Die zweite Hand ist aktiv.')
                        card1_finished = true;
                        newEmbed.addFields(
                            { name: 'Deine 1. Hand', value: playerCards1 + '\nTotal: ' + playerSum1, inline: true },
                            { name: 'Deine 2. Hand', value: playerCards2 + '\nTotal: ' + playerSum2, inline: true },
                            { name: 'Hand vom Dealer', value: dCard1.name + ', ?\nTotal: ?', inline: true },
                            { name: 'Info', value: '**Stand:** Das Spiel beenden\n**Hit:** Eine weitere Karte ziehen\n**Double:** Doppelter Einsatz, eine Karte ziehen und beenden\n**Fold:** Aufgeben, aber nur die Hälfte des Einsatzes verlieren'}
                        )
                        button.update({ embeds: [newEmbed], components: [row_3]});
                    }
                    else if (!card2_finished) {
                        let newCard2 = randomCard()
                        if (newCard2.value == 11) {
                            pSoft2 = true;
                        };
                        playerSum2 = playerSum2 + newCard2.value
                        if (playerSum2 > 21 && pSoft2) {
                            playerSum2 = playerSum2 - 10;
                            pSoft = false;
                        };
                        playerCards2.push(' ' + newCard2.name)
                        card2_finished = true;
                        const winner1 = await checkWinner(playerSum1, dealerSum)
                        const winner2 = await checkWinner(playerSum2, dealerSum)
                        const newEmbed2 = new MessageEmbed()
                            .setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userID}/${user.avatar}.webp`)
                            .setTitle('Blackjack')
                            .addFields(
                                { name: 'Deine 1. Hand', value: playerCards1 + '\nTotal: ' + playerSum1, inline: true },
                                { name: 'Deine 2. Hand', value: playerCards2 + '\nTotal: ' + playerSum2, inline: true },
                                { name: 'Hand vom Dealer', value: dealerCards + '\nTotal: ' + dealerSum, inline: true },
                            )
                            .setFooter('Azuma | Contact florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                            .setColor('5865F2')
                        if ((winner1 == 'player') & (winner2 == 'player')) {
                            // 2 Wins
                            credits = credits * 2;
                            newEmbed2.setDescription('Beide Hände sind besser als die vom Dealer! Glückwunsch!')
                            newEmbed2.setColor('57F287')
                        } else if (((winner1 == 'player') & (winner2 == 'dealer')) || ((winner2 == 'player') & (winner1 == 'dealer'))) {
                            // 1 Win, 1 Loose
                            credits = 0;
                            newEmbed2.setDescription('Nur eine Hand ist besser als die vom Dealer!')
                        } else if ((winner1 == 'dealer') & (winner2 == 'dealer')) {
                            // 2 Loses
                            credits = credits * -1;
                            newEmbed2.setDescription('Beide Hände sind schlechter als die vom Dealer!')
                            newEmbed2.setColor('ED4245')
                        } else if (((winner1 == 'player') & (winner2 == 'draw')) || ((winner2 == 'player') & (winner1 == 'draw'))) {
                            // 1 Win, 1 Draw
                            credits = (credits / 2);
                            newEmbed2.setDescription('Nur eine Hand ist besser als die vom Dealer!')
                            newEmbed2.setColor('57F287')
                        } else if (((winner1 == 'dealer') & (winner2 == 'draw')) || ((winner2 == 'dealer') & (winner1 == 'draw'))) {
                            // 1 Loose, 1 Draw
                            credits = (credits / 2) * -1;
                            newEmbed2.setDescription('Eine Hand ist schlechter und eine ist gleich! Das geht besser!')
                            newEmbed2.setColor('ED4245')
                        } else if ((winner1 == 'draw') & (winner2 == 'draw')) {
                            // 2 Draws
                            credits = 0;
                            newEmbed2.setDescription('Alle drei Hände sind gleich! Was ein Zufall.')
                        }
                        const newBalance = await economy.addCoins(userID, credits);
                        newEmbed2.addFields(
                            { name: 'Gewinn', value: credits + ' Credits' },
                            { name: 'Credits', value: 'Du hast jetzt ' + newBalance + ' Credits.' }
                        )
                        button.update({ embeds: [newEmbed2], components: [row_4]});
                        collector.stop();
                    }
                }
                else {
                    credits = credits + bet;
                    let newCard = randomCard();
                    if (newCard.value == 11) {
                        pSoft = true;
                    };
                    playerSum = playerSum + newCard.value;
                    if (playerSum > 21 && pSoft) {
                        pSoft = false;
                        playerSum = playerSum - 10;
                    };
                    playerCards.push(' ' + newCard.name);
                    const winner = await checkWinner(playerSum, dealerSum)
                    const newEmbed = new MessageEmbed()
                        .setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userID}/${user.avatar}.webp`)
                        .setTitle('Blackjack')
                        .addFields(
                            { name: 'Deine Hand', value: playerCards + '\nTotal: ' + playerSum, inline: true },
                            { name: 'Hand vom Dealer', value: dealerCards + '\nTotal: ' + dealerSum, inline: true },
                        )
                        .setFooter('Azuma | Contact florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                        .setColor('5865F2')
                    if (winner == 'player') {
                        const newBalance = await economy.addCoins(userID, credits);
                        newEmbed.setDescription('Du hast gewonnen und gewinnst das Doppelte!');
                        newEmbed.addFields(
                            { name: 'Gewinn', value: (credits * 2) + ' Credits' },
                            { name: 'Credits', value: 'Du hast jetzt ' + newBalance + ' Credits.' }
                        );
                        newEmbed.setColor('57F287');
                    }
                    else if (winner == 'dealer') {
                        const newBalance = await economy.addCoins(userID, credits * -1);
                        newEmbed.setDescription('Du hast die schlechtere Hand und verlierst alles!');
                        newEmbed.addFields(
                            { name: 'Gewinn', value: '-' + credits + ' Credits' },
                            { name: 'Credits', value: 'Du hast jetzt ' + newBalance + ' Credits.' }
                        );
                        newEmbed.setColor('ED4245');
                    }
                    else if (winner == 'draw') {
                        newEmbed.setDescription('Du hast gleichviel wie der Dealer! Unentschieden!');
                        newEmbed.addFields(
                            { name: 'Gewinn', value: '0 Credits' },
                            { name: 'Credits', value: 'Du hast jetzt ' + userCredits + ' Credits.' }
                        )
                    }
                    await button.update({ embeds: [newEmbed], components: [row_4]});
                    collector.stop();
                }
            }
            else if (button.customID == 'bjSplit') {
                credits = credits + bet;
                split = true;
                if (pCard1.value == 11) {
                    playerSum2 = 11;
                }
                const newEmbed = new MessageEmbed()
                    .setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userID}/${user.avatar}.webp`)
                    .setTitle('Blackjack')
                    .setDescription('Die erste Hand ist aktiv.')
                    .addFields(
                        { name: 'Deine 1. Hand', value: playerCards1 + '\nTotal: ' + playerSum1, inline: true },
                        { name: 'Deine 2. Hand', value: playerCards2 + '\nTotal: ' + playerSum2, inline: true },
                        { name: 'Hand vom Dealer', value: dCard1.name + ', ?\nTotal: ?', inline: true },
                        { name: 'Info', value: '**Stand:** Das Spiel beenden\n**Hit:** Eine weitere Karte ziehen\n**Double:** Doppelter Einsatz, eine Karte ziehen und beenden\n**Split:** Teile deinen Pot bei einem Paar\n**Fold:** Aufgeben, aber nur die Hälfte des Einsatzes verlieren'}
                    )                                
                    .setFooter('Azuma | Das Spiel läuft nach 5 Minuten Inaktivität ab.', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                    .setColor('5865F2');
                button.update({ embeds: [newEmbed], components: [row_3]});
            }
            else if (button.customID == 'bjFold') {
                const newEmbed = new MessageEmbed()
                    .setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userID}/${user.avatar}.webp`)
                    .setTitle('Blackjack')
                    .setDescription('Du hast aufgegeben und verlierst nur die Hälfte deines Einsatzes!')
                    .setFooter('Azuma | Contact florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
                    .setColor('ED4245');
                if (split) {
                    newEmbed.addFields(
                        { name: 'Deine 1. Hand', value: playerCards1 + '\nTotal: ' + playerSum1, inline: true },
                        { name: 'Deine 2. Hand', value: playerCards2 + '\nTotal: ' + playerSum2, inline: true },
                    )
                }
                else {
                    newEmbed.addFields(
                        { name: 'Deine Hand', value: playerCards + '\nTotal: ' + playerSum, inline: true },
                    )
                };
                const newBalance = await economy.addCoins(userID, (credits / 2) * -1);
                newEmbed.addFields(
                    { name: 'Hand vom Dealer', value: dCard1.name + ', ?\nTotal: ?', inline: true },
                    { name: 'Gewinn', value: '-' + Math.floor(credits / 2 ) + ' Credits' },
                    { name: 'Credits', value: 'Du hast jetzt ' + newBalance + ' Credits.'}
                );
                button.update({ embeds: [newEmbed], components: [row_4]});
                collector.stop();
            };
        });

        function checkWinner(pSum, dSum) {
            if (pSum > 21) {
                return 'dealer';
            }
            else if (pSum == dSum) {
                return 'draw';
            }
            else if (pSum <= 21) {
                if ((pSum > dSum) & (dSum <= 21)) {
                    return 'player';
                }
                else if (dSum > 21) {
                    return 'player';
                };
            };
            return 'dealer';
        };
    },
};