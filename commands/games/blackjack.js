const { MessageEmbed } = require("discord.js");
const { MessageButton, MessageActionRow } = require('discord-buttons');
const economy = require('../../features/economy');

module.exports = {
    description: 'Sahne große Gewinne bei Blackjack ab!',
    options: [
        {
            name: 'credits',
            description: 'Wieviel Geld möchtest du setzen?',
            type: 4,
            required: true
        }
    ],
    callback: async ({ args, client, interaction }) => {
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
                if (cards[i] === card) {
                    cards.splice(i, 1);
                }
            }
            return card;
        }

        // Player Cards
        const playerCards = [];
        const displayPlayerCards = [];
        const pCard1 = randomCard()
        const playerCard1 = pCard1.value
        const pCard2 = randomCard()
        let playerCard2 = pCard2.value
        if ((playerCard1 & playerCard2) === 11) {
            playerCard2 = 1;
        }
        playerCards.push(playerCard1)
        playerCards.push(playerCard2)
        displayPlayerCards.push(pCard1.name)
        displayPlayerCards.push(' ' + pCard2.name)
        let playerSum = playerCard1 + playerCard2;

        // Split Pot
        let split = false; 
        let card_1_finished; let card_2_finished;
        let card_1_disabled; let card_2_disabled;
        const playerCards_1 = [ playerCard1 ]
        const playerCards_2 = [ playerCard2 ]
        const displayPlayerCards_1 = [ pCard1.name ]
        const displayPlayerCards_2 = [ pCard2.name ]
        let playerSum_1 = playerCard1;
        let playerSum_2 = playerCard2;

        // Dealer Cards
        const dealerCards = [];
        const displayDealerCards = [];
        const dCard1 = randomCard()
        const dCard2 = randomCard()
        const dealerCard1 = dCard1.value
        let dealerCard2 = dCard2.value;
        if ((dealerCard1 & dealerCard2) === 11) {
            dealerCard2 = 1;
        }
        dealerCards.push(dealerCard1)
        dealerCards.push(dealerCard2)
        displayDealerCards.push(dCard1.name)
        displayDealerCards.push(' ' + dCard2.name)
        let dealerSum = dealerCard1 + dealerCard2;
    
        const embed = new MessageEmbed()
            .setTitle(`Blackjack - ${user.username}`)
            .addFields(
                { name: 'Deine Hand', value: displayPlayerCards + '\nTotal: ' + playerSum, inline: true },
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
                    { name: 'Deine Hand', value: displayPlayerCards + '\nTotal: ' + playerSum, inline: true },
                    { name: 'Dealer\'s Hand', value: displayDealerCards + '\nTotal: ' + dealerSum, inline: true },
                    { name: 'Gewinn', value: '-' + credits + ' Credits' },
                    { name: 'Credits', value: 'Du hast jetzt ' + (userCredits - credits) + ' Credits' }
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
                    let nCard = randomCard()
                    let newCard = nCard.value;
                    if ((newCard === 11) & (dealerSum > 10)) {
                        newCard = 1;
                    }
                    dealerCards.push(newCard)
                    displayDealerCards.push(' ' + nCard.name)
                    dealerSum = dealerSum + newCard;
                }
        
                const collector = msg.createButtonCollector((button) => userId == userId, { time: 300000 });
        
                collector.on('collect', async button => {
                    button.defer()

                    if (button.clicker.user.id == userId) {

                        if (button.id === 'bjStand') {
                            if (split) {
                                if (!card_1_finished) {
                                    card_1_finished = true;
                                    const newEmbed = new MessageEmbed()
                                        .setTitle(`Blackjack - ${user.username}`)
                                        .setDescription('Die zweite Hand ist aktiv.')
                                        .addFields(
                                            { name: 'Deine 1. Hand', value: displayPlayerCards_1 + '\nTotal: ' + playerSum_1, inline: true },
                                            { name: 'Deine 2. Hand', value: displayPlayerCards_2 + '\nTotal: ' + playerSum_2, inline: true },
                                            { name: 'Dealer\'s Hand', value: dCard1.name + '\nTotal: ' + dCard1.value, inline: true },
                                            { name: 'Info', value: '**Stand:** Das Spiel beenden\n**Hit:** Eine weitere Karte ziehen\n**Double:** Doppelter Einsatz, eine Karte ziehen und beenden\n**Fold:** Aufgeben, aber nur die Hälfte des Einsatzes verlieren'}
                                        )
                                        .setFooter('Das Spiel läuft nach 5 Minuten Inaktivität ab.')
                                        .setColor('5865F2')
                                    
                                    msg.edit({ components: row_3, embed: newEmbed })
                                } else if (card_1_finished) {
                                    card_2_finished == true;
                                    const winner1 = await checkWinner(playerSum_1, dealerSum)
                                    const winner2 = await checkWinner(playerSum_2, dealerSum)
                                    const newEmbed = new MessageEmbed()
                                        .setTitle(`Blackjack - ${user.username}`)
                                        .addFields(
                                            { name: 'Deine 1. Hand', value: displayPlayerCards_1 + '\nTotal: ' + playerSum_1, inline: true },
                                            { name: 'Deine 2. Hand', value: displayPlayerCards_2 + '\nTotal: ' + playerSum_2, inline: true },
                                            { name: 'Dealer\'s Hand', value: displayDealerCards + '\nTotal: ' + dealerSum, inline: true },
                                        )
                                        .setColor('5865F2')
                                    if ((winner1 == 'player') & (winner2 == 'player')) {
                                        // 2 Wins
                                        credits = credits * 2;
                                        newEmbed.setDescription('Beide Hände sind besser als die vom Dealer! Glückwunsch!')
                                        newEmbed.setColor('57F287')
                                    } else if (((winner1 == 'player') & (winner2 == 'dealer')) || ((winner2 == 'player') & (winner1 == 'dealer'))) {
                                        // 1 Win, 1 Loose
                                        credits = 0;
                                        newEmbed.setDescription('Nur eine Hand ist besser als die vom Dealer!')
                                    } else if ((winner1 == 'dealer') & (winner2 == 'dealer')) {
                                        // 2 Loses
                                        credits = credits * -1;
                                        newEmbed.setDescription('Beide Hände sind schlechter als die vom Dealer!')
                                        newEmbed.setColor('ED4245')
                                    } else if (((winner1 == 'player') & (winner2 == 'draw')) || ((winner2 == 'player') & (winner1 == 'draw'))) {
                                        // 1 Win, 1 Draw
                                        credits = (credits / 2);
                                        newEmbed.setDescription('Nur eine Hand ist besser als die vom Dealer!')
                                        newEmbed.setColor('57F287')
                                    } else if (((winner1 == 'dealer') & (winner2 == 'draw')) || ((winner2 == 'dealer') & (winner1 == 'draw'))) {
                                        // 1 Loose, 1 Draw
                                        credits = (credits / 2) * -1;
                                        newEmbed.setDescription('Eine Hand ist schlechter und eine ist gleich! Das geht besser!')
                                        newEmbed.setColor('ED4245')
                                    } else if ((winner1 == 'draw') & (winner2 == 'draw')) {
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
                            } else {
                                const winner = await checkWinner(playerSum, dealerSum)
                                const newEmbed = new MessageEmbed()
                                    .setTitle(`Blackjack - ${user.username}`)
                                    .addFields(
                                        { name: 'Deine Hand', value: displayPlayerCards + '\nTotal: ' + playerSum, inline: true },
                                        { name: 'Dealer\'s Hand', value: displayDealerCards + '\nTotal: ' + dealerSum, inline: true },
                                    )
                                    .setColor('5865F2')
                                if (winner == 'player') {
                                    newEmbed.setDescription('Du hast gewonnen!')
                                    newEmbed.addFields(
                                        { name: 'Gewinn', value: (credits * 2) + ' Credits' },
                                        { name: 'Credits', value: 'Du hast jetzt ' + (userCredits + credits) + ' Credits' }
                                    )
                                    newEmbed.setColor('57F287')
                                    await economy.addCoins(guildId, userId, credits);
                                } else if (winner == 'dealer') {
                                    newEmbed.setDescription('Du hast die schlechtere Hand und verlierst alles!')
                                    newEmbed.addFields(
                                        { name: 'Gewinn', value: '-' + credits + ' Credits' },
                                        { name: 'Credits', value: 'Du hast jetzt ' + (userCredits - credits) + ' Credits' }
                                    )
                                    newEmbed.setColor('ED4245')
                                    await economy.addCoins(guildId, userId, credits * -1);
                                } else if (winner == 'draw') {
                                    newEmbed.setDescription('Du hast gleichviel wie der Dealer! Unentschieden!');
                                    newEmbed.addFields(
                                        { name: 'Gewinn', value: '0 Credits' },
                                        { name: 'Credits', value: 'Du hast jetzt ' + userCredits + ' Credits' }
                                    )
                                }
                                msg.edit({ component: button_finished, embed: newEmbed })
                            }
                        } else if (button.id === 'bjHit') {
                            if (split) {
                                const newEmbed = new MessageEmbed()
                                .setTitle(`Blackjack - ${user.username}`)
                                .setFooter('Das Spiel läuft nach 5 Minuten Inaktivität ab.')
                                .setColor('5865F2');

                                if (!card_1_finished) {
                                    let nCard_1 = randomCard();
                                    let newCard_1 = nCard_1.value;
                                    if ((newCard_1 === 11) & (playerSum_1 > 10)) {
                                        newCard_1 = 1;
                                    }
                                    playerSum_1 = playerSum_1 + newCard_1
                                    playerCards_1.push(newCard_1)
                                    displayPlayerCards_1.push(' ' + nCard_1.name)
                                    if (playerSum_1 > 21) {
                                        card_1_disabled = true;
                                        card_1_finished = true;
                                        newEmbed.setDescription('Die zweite Hand ist aktiv.')
                                    }
                                    newEmbed.setDescription('Die erste Hand ist aktiv.')
                                } else if (!card_2_finished) {
                                    let nCard_2 = randomCard()
                                    let newCard_2 = nCard_2.value;
                                    if ((newCard_2 === 11) & (playerSum_2 > 10)) {
                                        newCard_2 = 1;
                                    }
                                    playerSum_2 = playerSum_2 + newCard_2
                                    playerCards_2.push(newCard_2)
                                    displayPlayerCards_2.push(' ' + nCard_2.name)
                                    if (playerSum_2 > 21) {
                                        card_2_disabled = true;
                                        card_2_finished = true;
                                    }
                                    newEmbed.setDescription('Die zweite Hand ist aktiv.')
                                }
                                newEmbed.addFields(
                                    { name: 'Deine 1. Hand', value: displayPlayerCards_1 + '\nTotal: ' + playerSum_1, inline: true },
                                    { name: 'Deine 2. Hand', value: displayPlayerCards_2 + '\nTotal: ' + playerSum_2, inline: true },
                                    { name: 'Dealer\'s Hand', value: dealerCard1 + '\nTotal: ' + dealerCard1, inline: true },
                                    { name: 'Info', value: '**Stand:** Das Spiel beenden\n**Hit:** Eine weitere Karte ziehen\n**Double:** Doppelter Einsatz, eine Karte ziehen und beenden\n**Fold:** Aufgeben, aber nur die Hälfte des Einsatzes verlieren'}
                                )

                                if (card_1_disabled & card_2_disabled) {
                                    const embed_3 = new MessageEmbed()
                                        .setTitle(`Blackjack - ${user.username}`)
                                        .setDescription('Beide Hände haben über 21 Augen und du verlierst alles!')
                                        .addFields(
                                            { name: 'Deine 1. Hand', value: displayPlayerCards_1 + '\nTotal: ' + playerSum_1, inline: true },
                                            { name: 'Deine 2. Hand', value: displayPlayerCards_2 + '\nTotal: ' + playerSum_2, inline: true },
                                            { name: 'Dealer\'s Hand', value: displayDealerCards + '\nTotal: ' + dealerSum, inline: true },
                                            { name: 'Gewinn', value: '-' + credits + ' Credits' },
                                            { name: 'Credits', value: 'Du hast jetzt ' + (userCredits - credits) + ' Credits' }
                                        )
                                        .setColor('ED4245')
                                    await economy.addCoins(guildId, userId, credits * -1);
                                    msg.edit({ component: button_finished, embed: embed_3 })
                                } else {
                                    msg.edit({ component: row_2, embed: newEmbed })
                                }
                            } else {
                                let nCard = randomCard();
                                let newCard = randomCard().value;
                                if ((newCard === 11) & (playerSum > 10)) {
                                    newCard = 1;
                                }
                                playerSum = playerSum + newCard
                                playerCards.push(newCard)
                                displayPlayerCards.push(' ' + nCard.name)
                                const newEmbed = new MessageEmbed()
                                    .setTitle(`Blackjack - ${user.username}`)
                                    .addFields(
                                        { name: 'Deine Hand', value: displayPlayerCards + '\nTotal: ' + playerSum, inline: true },
                                        { name: 'Dealer\'s Hand', value: dCard1.name + '\nTotal: ' + dealerCard1, inline: true },
                                        { name: 'Info', value: '**Stand:** Das Spiel beenden\n**Hit:** Eine weitere Karte ziehen\n**Double:** Doppelter Einsatz, eine Karte ziehen und beenden\n**Fold:** Aufgeben, aber nur die Hälfte des Einsatzes verlieren'}
                                    )
                                    .setFooter('Das Spiel läuft nach 5 Minuten Inaktivität ab.')
                                    .setColor('5865F2');
                                if (playerSum > 21) {
                                    const embed_3 = new MessageEmbed()
                                        .setTitle(`Blackjack - ${user.username}`)
                                        .setDescription('Du hast über 21 Augen und verlierst alles!')
                                        .addFields(
                                            { name: 'Deine Hand', value: displayPlayerCards + '\nTotal: ' + playerSum, inline: true },
                                            { name: 'Dealer\'s Hand', value: displayDealerCards + '\nTotal: ' + dealerSum, inline: true },
                                            { name: 'Gewinn', value: '-' + credits + ' Credits' },
                                            { name: 'Credits', value: 'Du hast jetzt ' + (userCredits - credits) + ' Credits' }
                                        )
                                        .setColor('ED4245')
                                    await economy.addCoins(guildId, userId, credits * -1);
                                    msg.edit({ component: button_finished, embed: embed_3 })
                                } else {
                                    msg.edit({ component: row_2, embed: newEmbed })
                                }
                            }
                        } else if (button.id === 'bjDouble') {
                            if (split) {
                                credits = credits + args.credits;
                                const newEmbed = new MessageEmbed()
                                    .setTitle(`Blackjack - ${user.username}`)
                                    .setFooter('Das Spiel läuft nach 5 Minuten Inaktivität ab.')
                                    .setColor('5865F2');

                                if (!card_1_finished) {
                                    let nCard_1 = randomCard();
                                    let newCard_1 = nCard_1.value;
                                    if ((newCard_1 === 11) & (playerSum_1 > 10)) {
                                        newCard_1 = 1;
                                    }
                                    playerSum_1 = playerSum_1 + newCard_1
                                    playerCards_1.push(newCard_1)
                                    displayPlayerCards_1.push(' ' + nCard_1.name)
                                    newEmbed.setDescription('Die zweite Hand ist aktiv.')
                                    card_1_finished = true;
                                    newEmbed.addFields(
                                        { name: 'Deine 1. Hand', value: displayPlayerCards_1 + '\nTotal: ' + playerSum_1, inline: true },
                                        { name: 'Deine 2. Hand', value: displayPlayerCards_2 + '\nTotal: ' + playerSum_2, inline: true },
                                        { name: 'Dealer\'s Hand', value: dealerCard1 + '\nTotal: ' + dealerCard1, inline: true },
                                        { name: 'Info', value: '**Stand:** Das Spiel beenden\n**Hit:** Eine weitere Karte ziehen\n**Double:** Doppelter Einsatz, eine Karte ziehen und beenden\n**Fold:** Aufgeben, aber nur die Hälfte des Einsatzes verlieren'}
                                    )
                                    msg.edit({component: row_3, embed: newEmbed })
                                } else if (!card_2_finished) {
                                    let nCard_2 = randomCard()
                                    let newCard_2 = nCard_2.value;
                                    if ((newCard_2 === 11) & (playerSum_2 > 10)) {
                                        newCard_2 = 1;
                                    }
                                    playerSum_2 = playerSum_2 + newCard_2
                                    playerCards_2.push(newCard_2)
                                    displayPlayerCards_2.push(' ' + nCard_2.name)
                                    card_2_finished = true;
                                    const winner1 = await checkWinner(playerSum_1, dealerSum)
                                    const winner2 = await checkWinner(playerSum_2, dealerSum)
                                    const newEmbed2 = new MessageEmbed()
                                        .setTitle(`Blackjack - ${user.username}`)
                                        .addFields(
                                            { name: 'Deine 1. Hand', value: displayPlayerCards_1 + '\nTotal: ' + playerSum_1, inline: true },
                                            { name: 'Deine 2. Hand', value: displayPlayerCards_2 + '\nTotal: ' + playerSum_2, inline: true },
                                            { name: 'Dealer\'s Hand', value: displayDealerCards + '\nTotal: ' + dealerSum, inline: true },
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
                                        { name: 'Credits', value: 'Du hast jetzt ' + (userCredits + credits) + ' Credits' }
                                    )
                                    await economy.addCoins(guildId, userId, credits);
                                    msg.edit({ component: button_finished, embed: newEmbed2 })
                                }
                            } else {
                                credits = credits * 2;
                                let nCard = randomCard();
                                let newCard = nCard.value;
                                if ((newCard === 11) & (playerSum > 10)) {
                                    newCard = 1;
                                }
                                playerSum = playerSum + newCard
                                playerCards.push(newCard)
                                displayPlayerCards.push(' ' + nCard.name)
                                const winner = await checkWinner(playerSum, dealerSum)
                                const newEmbed = new MessageEmbed()
                                    .setTitle(`Blackjack - ${user.username}`)
                                    .addFields(
                                        { name: 'Deine Hand', value: displayPlayerCards + '\nTotal: ' + playerSum, inline: true },
                                        { name: 'Dealer\'s Hand', value: displayDealerCards + '\nTotal: ' + dealerSum, inline: true },
                                    )
                                    .setColor('5865F2')
                                if (winner == 'player') {
                                    newEmbed.setDescription('Du hast gewonnen und gewinnst das Doppelte!')
                                    newEmbed.addFields(
                                        { name: 'Gewinn', value: (credits * 2) + ' Credits' },
                                        { name: 'Credits', value: 'Du hast jetzt ' + (userCredits + credits) + ' Credits' }
                                    )
                                    newEmbed.setColor('57F287')
                                    await economy.addCoins(guildId, userId, credits);
                                } else if (winner == 'dealer') {
                                    newEmbed.setDescription('Du hast die schlechtere Hand und verlierst alles!')
                                    newEmbed.addFields(
                                        { name: 'Gewinn', value: '-' + credits + ' Credits' },
                                        { name: 'Credits', value: 'Du hast jetzt ' + (userCredits - credits) + ' Credits' }
                                    )
                                    newEmbed.setColor('ED4245')
                                    await economy.addCoins(guildId, userId, credits * -1);
                                } else if (winner == 'draw') {
                                    newEmbed.setDescription('Du hast gleichviel wie der Dealer! Unentschieden!');
                                    newEmbed.addFields(
                                        { name: 'Gewinn', value: '0 Credits' },
                                        { name: 'Credits', value: 'Du hast jetzt ' + userCredits + ' Credits' }
                                    )
                                }
                                msg.edit({ component: button_finished, embed: newEmbed })
                            }
                        } else if (button.id === 'bjSplit') {
                            credits = credits * 2
                            split = true;
                            const newEmbed = new MessageEmbed()
                                .setTitle(`Blackjack - ${user.username}`)
                                .setDescription('Die erste Hand ist aktiv.')
                                .addFields(
                                    { name: 'Deine 1. Hand', value: displayPlayerCards_1 + '\nTotal: ' + playerSum_1, inline: true },
                                    { name: 'Deine 2. Hand', value: displayPlayerCards_2 + '\nTotal: ' + playerSum_2, inline: true },
                                    { name: 'Dealer\'s Hand', value: dCard1.name + '\nTotal: ' + dealerCard1, inline: true },
                                    { name: 'Info', value: '**Stand:** Das Spiel beenden\n**Hit:** Eine weitere Karte ziehen\n**Double:** Doppelter Einsatz, eine Karte ziehen und beenden\n**Split:** Teile deinen Pot bei einem Paar\n**Fold:** Aufgeben, aber nur die Hälfte des Einsatzes verlieren'}
                                )                                
                                .setFooter('Das Spiel läuft nach 5 Minuten Inaktivität ab.')
                                .setColor('5865F2');
                            msg.edit({ component: row_3, embed: newEmbed })
                        } else if (button.id === 'bjFold') {
                            const newEmbed = new MessageEmbed()
                                .setTitle(`Blackjack - ${user.username}`)
                                .setDescription('Du hast aufgegeben und verlierst nur die Hälfte deines Einsatzes!')
                                .setColor('ED4245')
                            if (split) {
                                newEmbed.addFields(
                                    { name: 'Deine 1. Hand', value: displayPlayerCards_1 + '\nTotal: ' + playerSum_1, inline: true },
                                    { name: 'Deine 2. Hand', value: displayPlayerCards_2 + '\nTotal: ' + playerSum_2, inline: true },
                                )
                            } else {
                                newEmbed.addFields(
                                    { name: 'Deine Hand', value: displayPlayerCards + '\nTotal: ' + playerSum, inline: true },
                                )
                            }
                            newEmbed.addFields(
                                { name: 'Dealer\'s Hand', value: dCard1.name + '\nTotal: ' + dealerCard1, inline: true },
                                { name: 'Gewinn', value: '-' + Math.floor(credits / 2 ) + ' Credits' },
                                { name: 'Credits', value: 'Du hast jetzt ' + (userCredits - (credits / 2)) + ' Credits'}
                            )
                            await economy.addCoins(guildId, userId, (credits / 2) * -1);
                            msg.edit({ component: button_finished, embed: newEmbed })
                        }
                    }
                    collector.on('end', async collected => {
                        msg.edit({ component: button_finished})
                        await economy.addCoins(guildId, userId, credits * -1);
                    })
                    collector.on('error', (e) => console.log(e))
                })
            });
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