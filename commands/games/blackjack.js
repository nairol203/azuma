const { MessageEmbed } = require("discord.js");
const { MessageButton, MessageActionRow } = require('discord-buttons');
const economy = require('../../features/economy');

module.exports = {
    callback: async ({ client, interaction, args }) => {
        const guildId = interaction.guild_id;
        const user = interaction.member.user;
        const userId = user.id;
        const channel = client.channels.cache.get(interaction.channel_id)
        let credits = args.credits;
        let userCredits = await economy.getCoins(guildId, userId)
        if (userCredits < credits) {
            return [ 'Du hast nicht genug Credits um mit diesem Einsatz spielen zu können!' ];
        }

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
        ]

        function randomCard() {
            const card = cards[Math.floor(Math.random()*cards.length)];
            for (i = 0; i < cards.length; i++) {
                if (cards[i] == card) {
                    cards.splice(i, 1);
                }
            }
            return card;
        }

        // Player Cards
        let pSoft;
        const pCard1 = randomCard();
        if (pCard1.value == 11) {
            pSoft = true;
        } 
        const pCard2 = randomCard();
        if ((pCard1.value & pCard1.value) == 11) {
            pCard2.value = 1
        }
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
        }
        playerCards1.push(pCard1.name);
        playerCards2.push(' ' + pCard2.name);
        let playerSum1 = pCard1.value;
        let playerSum2 = pCard2.value;

        // Dealer Cards
        let dSoft;
        const dCard1 = randomCard()
        if (dCard1.value == 11) {
            dSoft = true;
        }
        const dCard2 = randomCard()
        if ((dCard1.value & dCard2.value == 11)) {
            pCard2.value = 1;
        }
        const dealerCards = [];
        dealerCards.push(dCard1.name);
        dealerCards.push(' ' + dCard2.name);
        let dealerSum = dCard1.value + dCard2.value;

        const embed = new MessageEmbed()
            .setTitle(`Blackjack - ${user.username}`)
            .addFields(
                { name: 'Deine Hand', value: playerCards + '\nTotal: ' + playerSum, inline: true },
                { name: 'Dealer\'s Hand', value: dCard1.name + '\nTotal: ' + dCard1.value, inline: true },
                { name: 'Info', value: '**Stand:** Das Spiel beenden\n**Hit:** Eine weitere Karte ziehen\n**Double:** Doppelter Einsatz, eine Karte ziehen und beenden\n**Split:** Teile deinen Pot bei einem Paar\n**Fold:** Aufgeben, aber nur die Hälfte des Einsatzes verlieren'}
            )
            .setFooter('Das Spiel läuft nach 5 Minuten Inaktivität ab.')
            .setColor('5865F2');

        const button_stand = new MessageButton()
            .setStyle('green')
            .setLabel('Stand')
            .setID('bjStand');

        const button_hit = new MessageButton()
            .setStyle('blurple')
            .setLabel('Hit')
            .setID('bjHit');

        const button_double = new MessageButton()
            .setStyle('gray')
            .setLabel('Double')
            .setID('bjDouble');

        const button_double_disabled = new MessageButton()
            .setStyle('gray')
            .setLabel('Double')
            .setID('bjDouble')
            .setDisabled(true);

        const button_split = new MessageButton()
            .setStyle('gray')
            .setLabel('Split')
            .setID('bjSplit');

        const button_split_disabled = new MessageButton()
            .setStyle('gray')
            .setLabel('Split')
            .setID('bjSplit')
            .setDisabled(true);

        const button_fold = new MessageButton()
            .setStyle('gray')
            .setLabel('Fold')
            .setID('bjFold');

        const button_finished = new MessageButton()
            .setStyle('gray')
            .setLabel('Spiel beendet')
            .setID('hurensohn')
            .setDisabled(true);

        if (pCard1.name !== pCard2.name) {
            button_split.setDisabled(true)
        }

        if (dealerSum == 21) {
            const newEmbed = new MessageEmbed()
                .setTitle(`Blackjack - ${user.username}`)
                .setDescription('Der Dealer hat einen Blackjack mit den ersten beiden Karten!')
                .addFields(
                    { name: 'Deine Hand', value: playerCards + '\nTotal: ' + playerSum, inline: true },
                    { name: 'Dealer\'s Hand', value: dealerCards + '\nTotal: ' + dealerSum, inline: true },
                    { name: 'Gewinn', value: '-' + credits + ' Credits' },
                    { name: 'Credits', value: 'Du hast jetzt ' + (userCredits - credits) + ' Credits.' }
                )
                .setColor('ED4245')
            await economy.addCoins(guildId, userId, credits * -1);
            setTimeout(() => {
                channel.send({ component: button_finished, embed: newEmbed }); 
            }, 500);
            return 'Es wird Blackjack gespielt...';
        }

        const row = new MessageActionRow()
            .addComponents([ button_stand, button_hit, button_double, button_split, button_fold ])

        const row_2 = new MessageActionRow()
            .addComponents([ button_stand, button_hit, button_double_disabled, button_split_disabled, button_fold ])

        const row_3 = new MessageActionRow()
            .addComponents([ button_stand, button_hit, button_double, button_split_disabled, button_fold ])

        setTimeout(() => {
            channel.send({ component: row, embed: embed }).then(async msg => {
                while (dealerSum < 17) {
                    let newCard = randomCard()
                    if ((newCard.value == 11) & (dealerSum > 10)) {
                        newCard.value = 1;
                    }
                    if ((dealerSum > 21) & dSoft == true) {
                        dSoft = false;
                        dealerSum = dealerSum - 10;
                    }
                    dealerCards.push(' ' + newCard.name)
                    dealerSum = dealerSum + newCard.value;
                }

                const collector = msg.createButtonCollector((button) => userId == userId, { time: 300000 });

                collector.on('collect', async button => {
                    button.defer();

                    if (button.clicker.user.id == userId) {
                        if (button.id == 'bjStand') {
                            if (split) {
                                if (!card1_finished) {
                                    card1_finished = true;
                                    const newEmbed = new MessageEmbed()
                                        .setTitle(`Blackjack - ${user.username}`)
                                        .setDescription('Die zweite Hand ist aktiv.')
                                        .addFields(
                                            { name: 'Deine 1. Hand', value: playerCards1 + '\nTotal: ' + playerSum1, inline: true },
                                            { name: 'Deine 2. Hand', value: playerCards2 + '\nTotal: ' + playerSum2, inline: true },
                                            { name: 'Dealer\'s Hand', value: dCard1.name + '\nTotal: ' + dCard1.value, inline: true },
                                            { name: 'Info', value: '**Stand:** Das Spiel beenden\n**Hit:** Eine weitere Karte ziehen\n**Double:** Doppelter Einsatz, eine Karte ziehen und beenden\n**Fold:** Aufgeben, aber nur die Hälfte des Einsatzes verlieren'}
                                        )
                                        .setFooter('Das Spiel läuft nach 5 Minuten Inaktivität ab.')
                                        .setColor('5865F2')
                                    
                                    msg.edit({ components: row_3, embed: newEmbed })
                                }
                                else if (card1_finished) {
                                    card2_finished == true;
                                    const winner1 = await checkWinner(playerSum1, dealerSum)
                                    const winner2 = await checkWinner(playerSum2, dealerSum)
                                    const newEmbed = new MessageEmbed()
                                        .setTitle(`Blackjack - ${user.username}`)
                                        .addFields(
                                            { name: 'Deine 1. Hand', value: playerCards1 + '\nTotal: ' + playerSum1, inline: true },
                                            { name: 'Deine 2. Hand', value: playerCards2 + '\nTotal: ' + playerSum2, inline: true },
                                            { name: 'Dealer\'s Hand', value: dealerCards + '\nTotal: ' + dealerSum, inline: true },
                                        )
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
                                    newEmbed.addFields(
                                        { name: 'Gewinn', value: credits + ' Credits' },
                                        { name: 'Credits', value: 'Du hast jetzt ' + (userCredits + credits) + ' Credits' }
                                    )
                                    await economy.addCoins(guildId, userId, credits);
                                    msg.edit({ component: button_finished, embed: newEmbed })
                                }
                            }
                            else {
                                const winner = await checkWinner(playerSum, dealerSum)
                                const newEmbed = new MessageEmbed()
                                    .setTitle(`Blackjack - ${user.username}`)
                                    .addFields(
                                        { name: 'Deine Hand', value: playerCards + '\nTotal: ' + playerSum, inline: true },
                                        { name: 'Dealer\'s Hand', value: dealerCards + '\nTotal: ' + dealerSum, inline: true },
                                    )
                                    .setColor('5865F2')
                                if (winner == 'player') {
                                    newEmbed.setDescription('Du hast die bessere Hand! Glückwunsch!')
                                    newEmbed.addFields(
                                        { name: 'Gewinn', value: (credits * 2) + ' Credits' },
                                        { name: 'Credits', value: 'Du hast jetzt ' + (userCredits + credits) + ' Credits.' }
                                    )
                                    newEmbed.setColor('57F287')
                                    await economy.addCoins(guildId, userId, credits);
                                }
                                else if (winner == 'dealer') {
                                    newEmbed.setDescription('Du hast die schlechtere Hand und verlierst alles!')
                                    newEmbed.addFields(
                                        { name: 'Gewinn', value: '-' + credits + ' Credits' },
                                        { name: 'Credits', value: 'Du hast jetzt ' + (userCredits - credits) + ' Credits.' }
                                    )
                                    newEmbed.setColor('ED4245')
                                    await economy.addCoins(guildId, userId, credits * -1);
                                }
                                else if (winner == 'draw') {
                                    newEmbed.setDescription('Du hast gleichviel wie der Dealer! Unentschieden!');
                                    newEmbed.addFields(
                                        { name: 'Gewinn', value: '0 Credits' },
                                        { name: 'Credits', value: 'Du hast jetzt ' + userCredits + ' Credits.' }
                                    )
                                }
                                msg.edit({ component: button_finished, embed: newEmbed })
                            }
                        }
                        else if (button.id == 'bjHit') {
                            if (split) {
                                const newEmbed = new MessageEmbed()
                                    .setTitle(`Blackjack - ${user.username}`)
                                    .setFooter('Das Spiel läuft nach 5 Minuten Inaktivität ab.')
                                    .setColor('5865F2');

                                if (!card1_finished) {
                                    let newCard1 = randomCard();
                                    if ((newCard1.value == 11) & (playerSum1 > 10)) {
                                        newCard1.value = 1;
                                    }
                                    playerSum1 = playerSum1 + newCard1.value
                                    if (playerSum1 > 21) {
                                        if (pSoft1) {
                                            playerSum1 = playerSum1 - 10;
                                            pSoft1 = false;
                                        }
                                    }
                                    playerCards1.push(' ' + newCard1.name)
                                    if (playerSum1 > 21) {
                                        card1_finished = true;
                                        newEmbed.setDescription('Die zweite Hand ist aktiv.')
                                    }
                                    newEmbed.setDescription('Die erste Hand ist aktiv.')
                                }
                                else if (!card2_finished) {
                                    let newCard2 = randomCard()
                                    if ((newCard2.value == 11) & (playerSum2 > 10)) {
                                        newCard2.value = 1;
                                    }
                                    playerSum2 = playerSum2 + newCard2.value
                                    if (playerSum2 > 21) {
                                        if (pSoft2) {
                                            playerSum2 = playerSum2 - 10;
                                            pSoft2 = false;
                                        }
                                    }
                                    playerCards2.push(' ' + newCard2.name)
                                    if (playerSum2 > 21) {
                                        card2_finished = true;
                                    }
                                    newEmbed.setDescription('Die zweite Hand ist aktiv.')
                                }
                                newEmbed.addFields(
                                    { name: 'Deine 1. Hand', value: playerCards1 + '\nTotal: ' + playerSum1, inline: true },
                                    { name: 'Deine 2. Hand', value: playerCards2 + '\nTotal: ' + playerSum2, inline: true },
                                    { name: 'Dealer\'s Hand', value: dCard1.name + '\nTotal: ' + dCard1.value, inline: true },
                                    { name: 'Info', value: '**Stand:** Das Spiel beenden\n**Hit:** Eine weitere Karte ziehen\n**Double:** Doppelter Einsatz, eine Karte ziehen und beenden\n**Fold:** Aufgeben, aber nur die Hälfte des Einsatzes verlieren'}
                                )

                                if ((playerSum1 & playerSum2) > 21) {
                                    const embed_3 = new MessageEmbed()
                                        .setTitle(`Blackjack - ${user.username}`)
                                        .setDescription('Beide Hände haben über 21 Augen und du verlierst alles!')
                                        .addFields(
                                            { name: 'Deine 1. Hand', value: playerCards1 + '\nTotal: ' + playerSum1, inline: true },
                                            { name: 'Deine 2. Hand', value: playerCards2 + '\nTotal: ' + playerSum2, inline: true },
                                            { name: 'Dealer\'s Hand', value: dCard1.name + '\nTotal: ' + dCard1.value, inline: true },
                                            { name: 'Gewinn', value: '-' + credits + ' Credits' },
                                            { name: 'Credits', value: 'Du hast jetzt ' + (userCredits - credits) + ' Credits.' }
                                        )
                                        .setColor('ED4245')
                                    await economy.addCoins(guildId, userId, credits * -1);
                                    msg.edit({ component: button_finished, embed: embed_3 })
                                } else {
                                    msg.edit({ component: row_2, embed: newEmbed })
                                }
                            }
                            else {
                                let newCard = randomCard();
                                if ((newCard.value == 11) & (playerSum > 10)) {
                                    newCard.value = 1;
                                }
                                playerSum = playerSum + newCard.value;
                                if (playerSum > 21) {
                                    if (pSoft) {
                                        playerSum = playerSum - 10;
                                        pSoft = false;
                                    }
                                }
                                playerCards.push(' ' + newCard.name);
                                const newEmbed = new MessageEmbed()
                                    .setTitle(`Blackjack - ${user.username}`)
                                    .addFields(
                                        { name: 'Deine Hand', value: playerCards + '\nTotal: ' + playerSum, inline: true },
                                        { name: 'Dealer\'s Hand', value: dCard1.name + '\nTotal: ' + dCard1.value, inline: true },
                                        { name: 'Info', value: '**Stand:** Das Spiel beenden\n**Hit:** Eine weitere Karte ziehen\n**Double:** Doppelter Einsatz, eine Karte ziehen und beenden\n**Fold:** Aufgeben, aber nur die Hälfte des Einsatzes verlieren'}
                                    )
                                    .setFooter('Das Spiel läuft nach 5 Minuten Inaktivität ab.')
                                    .setColor('5865F2');
                                if (playerSum > 21) {
                                    const embed_3 = new MessageEmbed()
                                        .setTitle(`Blackjack - ${user.username}`)
                                        .setDescription('Du hast über 21 Augen und verlierst alles!')
                                        .addFields(
                                            { name: 'Deine Hand', value: playerCards + '\nTotal: ' + playerSum, inline: true },
                                            { name: 'Dealer\'s Hand', value: dCard1.name + '\nTotal: ' + dCard1.value, inline: true },
                                            { name: 'Gewinn', value: '-' + credits + ' Credits' },
                                            { name: 'Credits', value: 'Du hast jetzt ' + (userCredits - credits) + ' Credits.' }
                                        )
                                        .setColor('ED4245')
                                    await economy.addCoins(guildId, userId, credits * -1);
                                    msg.edit({ component: button_finished, embed: embed_3 })
                                } else {
                                    msg.edit({ component: row_2, embed: newEmbed })
                                }
                            }
                        }
                        else if (button.id == 'bjDouble') {
                            if (split) {
                                credits = credits + args.credits;
                                const newEmbed = new MessageEmbed()
                                    .setTitle(`Blackjack - ${user.username}`)
                                    .setFooter('Das Spiel läuft nach 5 Minuten Inaktivität ab.')
                                    .setColor('5865F2');

                                if (!card1_finished) {
                                    let newCard1 = randomCard();
                                    if ((newCard1.value == 11) & (playerSum1 > 10)) {
                                        newCard1.value = 1;
                                    }
                                    playerCards1.push(' ' + newCard1.name)
                                    newEmbed.setDescription('Die zweite Hand ist aktiv.')
                                    card1_finished = true;
                                    newEmbed.addFields(
                                        { name: 'Deine 1. Hand', value: playerCards1 + '\nTotal: ' + playerSum1, inline: true },
                                        { name: 'Deine 2. Hand', value: playerCards2 + '\nTotal: ' + playerSum2, inline: true },
                                        { name: 'Dealer\'s Hand', value: dCard1.name + '\nTotal: ' + dCard1.value, inline: true },
                                        { name: 'Info', value: '**Stand:** Das Spiel beenden\n**Hit:** Eine weitere Karte ziehen\n**Double:** Doppelter Einsatz, eine Karte ziehen und beenden\n**Fold:** Aufgeben, aber nur die Hälfte des Einsatzes verlieren'}
                                    )
                                    msg.edit({component: row_3, embed: newEmbed })
                                }
                                else if (!card2_finished) {
                                    let newCard2 = randomCard()
                                    if ((newCard2.value == 11) & (playerSum2 > 10)) {
                                        newCard2.value = 1;
                                    }
                                    playerSum2 = playerSum2 + newCard2.value
                                    playerCards2.push(' ' + newCard2.name)
                                    card2_finished = true;
                                    const winner1 = await checkWinner(playerSum1, dealerSum)
                                    const winner2 = await checkWinner(playerSum2, dealerSum)
                                    const newEmbed2 = new MessageEmbed()
                                        .setTitle(`Blackjack - ${user.username}`)
                                        .addFields(
                                            { name: 'Deine 1. Hand', value: playerCards1 + '\nTotal: ' + playerSum1, inline: true },
                                            { name: 'Deine 2. Hand', value: playerCards2 + '\nTotal: ' + playerSum2, inline: true },
                                            { name: 'Dealer\'s Hand', value: dealerCards + '\nTotal: ' + dealerSum, inline: true },
                                        )
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
                                    newEmbed2.addFields(
                                        { name: 'Gewinn', value: credits + ' Credits' },
                                        { name: 'Credits', value: 'Du hast jetzt ' + (userCredits + credits) + ' Credits.' }
                                    )
                                    await economy.addCoins(guildId, userId, credits);
                                    msg.edit({ component: button_finished, embed: newEmbed2 })
                                }
                            }
                            else {
                                credits = credits * 2;
                                let newCard = randomCard();
                                if ((newCard.value == 11) & (playerSum > 10)) {
                                    newCard.value = 1;
                                }
                                playerSum = playerSum + newCard.value;
                                if (playerSum > 21) {
                                    if (pSoft) {
                                        pSoft = false;
                                        playerSum = playerSum - 10;
                                    }
                                }
                                playerCards.push(' ' + newCard.name);
                                const winner = await checkWinner(playerSum, dealerSum)
                                const newEmbed = new MessageEmbed()
                                    .setTitle(`Blackjack - ${user.username}`)
                                    .addFields(
                                        { name: 'Deine Hand', value: playerCards + '\nTotal: ' + playerSum, inline: true },
                                        { name: 'Dealer\'s Hand', value: dealerCards + '\nTotal: ' + dealerSum, inline: true },
                                    )
                                    .setColor('5865F2')
                                if (winner == 'player') {
                                    newEmbed.setDescription('Du hast gewonnen und gewinnst das Doppelte!')
                                    newEmbed.addFields(
                                        { name: 'Gewinn', value: (credits * 2) + ' Credits' },
                                        { name: 'Credits', value: 'Du hast jetzt ' + (userCredits + credits) + ' Credits.' }
                                    )
                                    newEmbed.setColor('57F287')
                                    await economy.addCoins(guildId, userId, credits);
                                }
                                else if (winner == 'dealer') {
                                    newEmbed.setDescription('Du hast die schlechtere Hand und verlierst alles!')
                                    newEmbed.addFields(
                                        { name: 'Gewinn', value: '-' + credits + ' Credits' },
                                        { name: 'Credits', value: 'Du hast jetzt ' + (userCredits - credits) + ' Credits.' }
                                    )
                                    newEmbed.setColor('ED4245')
                                    await economy.addCoins(guildId, userId, credits * -1);
                                }
                                else if (winner == 'draw') {
                                    newEmbed.setDescription('Du hast gleichviel wie der Dealer! Unentschieden!');
                                    newEmbed.addFields(
                                        { name: 'Gewinn', value: '0 Credits' },
                                        { name: 'Credits', value: 'Du hast jetzt ' + userCredits + ' Credits.' }
                                    )
                                }
                                msg.edit({ component: button_finished, embed: newEmbed })
                            }
                        }
                        else if (button.id == 'bjSplit') {
                            credits = credits * 2
                            split = true;
                            if (pCard1.value == 11) {
                                playerSum2 = 11;
                            }
                            const newEmbed = new MessageEmbed()
                                .setTitle(`Blackjack - ${user.username}`)
                                .setDescription('Die erste Hand ist aktiv.')
                                .addFields(
                                    { name: 'Deine 1. Hand', value: playerCards1 + '\nTotal: ' + playerSum1, inline: true },
                                    { name: 'Deine 2. Hand', value: playerCards2 + '\nTotal: ' + playerSum2, inline: true },
                                    { name: 'Dealer\'s Hand', value: dCard1.name + '\nTotal: ' + dCard1.value, inline: true },
                                    { name: 'Info', value: '**Stand:** Das Spiel beenden\n**Hit:** Eine weitere Karte ziehen\n**Double:** Doppelter Einsatz, eine Karte ziehen und beenden\n**Split:** Teile deinen Pot bei einem Paar\n**Fold:** Aufgeben, aber nur die Hälfte des Einsatzes verlieren'}
                                )                                
                                .setFooter('Das Spiel läuft nach 5 Minuten Inaktivität ab.')
                                .setColor('5865F2');
                            msg.edit({ component: row_3, embed: newEmbed })
                        }
                        else if (button.id == 'bjFold') {
                            const newEmbed = new MessageEmbed()
                                .setTitle(`Blackjack - ${user.username}`)
                                .setDescription('Du hast aufgegeben und verlierst nur die Hälfte deines Einsatzes!')
                                .setColor('ED4245')
                            if (split) {
                                newEmbed.addFields(
                                    { name: 'Deine 1. Hand', value: playerCards1 + '\nTotal: ' + playerSum1, inline: true },
                                    { name: 'Deine 2. Hand', value: playerCards2 + '\nTotal: ' + playerSum2, inline: true },
                                )
                            } else {
                                newEmbed.addFields(
                                    { name: 'Deine Hand', value: playerCards + '\nTotal: ' + playerSum, inline: true },
                                )
                            }
                            newEmbed.addFields(
                                { name: 'Dealer\'s Hand', value: dCard1.name + '\nTotal: ' + dCard1.value, inline: true },
                                { name: 'Gewinn', value: '-' + Math.floor(credits / 2 ) + ' Credits' },
                                { name: 'Credits', value: 'Du hast jetzt ' + (userCredits - (credits / 2)) + ' Credits.'}
                            )
                            await economy.addCoins(guildId, userId, (credits / 2) * -1);
                            msg.edit({ component: button_finished, embed: newEmbed })
                        }
                    }
                })

                collector.on('end', async collected => {
                    msg.edit({ component: button_finished})
                    await economy.addCoins(guildId, userId, credits * -1)
                })

                collector.on('error', (e) => console.error(e))
            })
        }, 500);

        function checkWinner(pSum, dSum) {
            if (pSum == dSum) {
                return 'draw';
            }
            if (pSum <= 21) {
                if ((pSum > dSum) & (dSum <= 21)) {
                    return 'player';
                } else if (dSum > 21) {
                    return 'player';
                }
            }
            return 'dealer';
        }
        return 'Es wird Blackjack gespielt...';
    }
}