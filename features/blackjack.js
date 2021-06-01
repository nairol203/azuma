const { MessageEmbed } = require("discord.js");
const { MessageButton } = require('discord-buttons');

module.exports.handleBj = (client, interaction) => {
    const userId = interaction.member.user.id;
    const channel = client.channels.cache.get(interaction.channel_id)

    const cards = [ 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11 ]

    function randomCard() {
        const card = cards[Math.floor(Math.random()*cards.length)];
        return card;
    }

    const playerCards = [];
    const playerCard1 = randomCard()
    let playerCard2 = randomCard()
    if ((playerCard1 & playerCard2) === 11) {
        playerCard2 = 1;
    }
    playerCards.push(playerCard1)
    playerCards.push(playerCard2)
    let playerSum = playerCard1 + playerCard2;

    const dealerCards = [];
    const dealerCard1 = randomCard()
    dealerCards.push(dealerCard1)
    let dealerSum = dealerCard1;

    const embed = new MessageEmbed()
        .setTitle('Blackjack')
        .addFields(
            { name: 'Deine Hand', value: playerCards + '\nTotal: ' + playerSum, inline: true },
            { name: 'Dealer\'s Hand', value: dealerCards + '\nTotal: ' + dealerSum, inline: true }
        )

    const bStand = new MessageButton()
        .setStyle('blurple')
        .setLabel('Stand')
        .setID('bjStand')

    const bHit = new MessageButton()
        .setStyle('blurple')
        .setLabel('Hit')
        .setID('bjHit')

    const bDouble = new MessageButton()
        .setStyle('blurple')
        .setLabel('Double')
        .setID('bjDouble')

    const bFold = new MessageButton()
        .setStyle('blurple')
        .setLabel('Fold')
        .setID('bjFold')

    const bStandD = new MessageButton()
        .setStyle('gray')
        .setLabel('Spiel beendet')
        .setID('hurensohn')
        .setDisabled(true);

    channel.send({ buttons: [ bStand, bHit, bDouble, bFold ], embed: embed }).then(async msg => {
        sendMessage = msg;
        while (dealerSum < 18) {
            let newCard = randomCard();
            if ((newCard === 11) & (dealerSum > 10)) {
                newCard = 1;
            }
            dealerCards.push(newCard)
            dealerSum = dealerSum + newCard;
        }
    });

    client.on('clickButton', async (button) => {
        if (button.clicker.user.id ==! userId) return
        if (button.id === 'bjStand') {
            button.defer()
            const newEmbed = new MessageEmbed()
                .setTitle('Blackjack')
                .addFields(
                    { name: 'Deine Hand', value: playerCards + '\nTotal: ' + playerSum, inline: true },
                    { name: 'Dealer\'s Hand', value: dealerCards + '\nTotal: ' + dealerSum, inline: true }
                )
            newEmbed.setDescription('Du hast verloren!')
            if (playerSum === dealerSum) {
                newEmbed.setDescription('Du hast gleichviel wie der Dealer! Unentschieden!')
            }
            if ((playerSum < 22) & ((playerSum !== dealerSum))) {
                if ((playerSum > dealerSum) || (dealerSum > 21)) {
                    newEmbed.setDescription('Du hast gewonnen!')
                }
            }
            sendMessage.edit({ buttons: [ bStandD ], embed: newEmbed })
        } else if (button.id === 'bjHit') {
            button.defer()
            let newCard = randomCard();
            if ((newCard === 11) & (playerSum > 10)) {
                newCard = 1;
            }
            playerSum = playerSum + newCard
            playerCards.push(newCard)
            const newEmbed = new MessageEmbed()
                .setTitle('Blackjack')
                .addFields(
                    { name: 'Deine Hand', value: playerCards + '\nTotal: ' + playerSum, inline: true },
                    { name: 'Dealer\'s Hand', value: dealerCard1 + '\nTotal: ' + dealerCard1, inline: true }
                )
            if (playerSum > 21) {
                newEmbed.setDescription('Du hast verloren!')
                sendMessage.edit({ buttons: [ bStandD ], embed: newEmbed })
            } else {
                sendMessage.edit(newEmbed)
            }
        } else if (button.id === 'bjDouble') {
            button.defer()
            let newCard = randomCard();
            if ((newCard === 11) & (playerSum > 10)) {
                newCard = 1;
            }
            playerSum = playerSum + newCard
            playerCards.push(newCard)
            const newEmbed = new MessageEmbed()
                .setTitle('Blackjack')
                .addFields(
                    { name: 'Deine Hand', value: playerCards + '\nTotal: ' + playerSum, inline: true },
                    { name: 'Dealer\'s Hand', value: dealerCards + '\nTotal: ' + dealerSum, inline: true }
                )
            newEmbed.setDescription('Du hast verloren!')
            if (playerSum === dealerSum) {
                newEmbed.setDescription('Du hast gleichviel wie der Dealer! Unentschieden!')
            }
            if ((playerSum < 22) & ((playerSum !== dealerSum))) {
                if ((playerSum > dealerSum) || (dealerSum > 21)) {
                    newEmbed.setDescription('Du hast gewonnen!')
                }
            }
            sendMessage.edit({ buttons: [ bStandD ], embed: newEmbed })
        } else if (button.id === 'bjFold') {
            button.defer()
            const newEmbed = new MessageEmbed()
                .setTitle('Blackjack')
                .setDescription('Du hast verloren!')
                .addFields(
                    { name: 'Deine Hand', value: playerCards + '\nTotal: ' + playerSum, inline: true },
                    { name: 'Dealer\'s Hand', value: dealerCards + '\nTotal: ' + dealerSum, inline: true }
                )
            sendMessage.edit({ buttons: [ bStandD ], embed: newEmbed })
        }
    })
}