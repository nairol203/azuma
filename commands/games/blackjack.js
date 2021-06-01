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
        const credits = args.credits;
        const userCredits = await economy.getCoins(guildId, userId)
        if (userCredits < credits) {
            return [ 'Du hast nicht genug Credits um mit diesem Einsatz spielen zu können!' ];
        }
        await economy.addCoins(guildId, userId, credits * -1);

        const cards = [ 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11 ]
    
        async function getCredits() {
            const result = await economy.getCoins(guildId, userId);
            return result;
        }

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
            .setTitle(`Blackjack - ${user.username}`)
            .addFields(
                { name: 'Deine Hand', value: playerCards + '\nTotal: ' + playerSum, inline: true },
                { name: 'Dealer\'s Hand', value: dealerCards + '\nTotal: ' + dealerSum, inline: true },
                { name: 'Info', value: '**Stand:** Das Spiel beenden\n**Hit:** Eine weitere Karte ziehen\n**Double:** Doppelter Einsatz, eine Karte ziehen und beenden\n**Fold:** Aufgeben, aber nur die Hälfte des Einsatzes verlieren'}
            )
            .setFooter('Das Spiel läuft nach 5 Minuten Inaktivität ab.')
            .setColor('5865F2');
    
        const button_stand = new MessageButton()
            .setStyle('green')
            .setLabel('Stand')
            .setID('bjStand')
    
        const button_hit = new MessageButton()
            .setStyle('blurple')
            .setLabel('Hit')
            .setID('bjHit')
    
        const button_double = new MessageButton()
            .setStyle('gray')
            .setLabel('Double')
            .setID('bjDouble')
    
        const button_fold = new MessageButton()
            .setStyle('gray')
            .setLabel('Fold')
            .setID('bjFold')
    
        const button_finished = new MessageButton()
            .setStyle('gray')
            .setLabel('Spiel beendet')
            .setID('hurensohn')
            .setDisabled(true);
    
        const row = new MessageActionRow()
            .addComponents([ button_stand, button_hit, button_double, button_fold ])

        channel.send({ component: row, embed: embed }).then(async msg => {

            while (dealerSum < 18) {
                let newCard = randomCard();
                if ((newCard === 11) & (dealerSum > 10)) {
                    newCard = 1;
                }
                dealerCards.push(newCard)
                dealerSum = dealerSum + newCard;
            }
    
            const collector = msg.createButtonCollector((button) => userId == userId, { time: 300000 });
    
            collector.on('collect', async button => {
                button.defer()

                if (button.clicker.user.id == userId) {
                    
                    if (button.id === 'bjStand') {
                        const winner = await checkWinner()
                        const newEmbed = new MessageEmbed()
                            .setTitle(`Blackjack - ${user.username}`)
                            .addFields(
                                { name: 'Deine Hand', value: playerCards + '\nTotal: ' + playerSum, inline: true },
                                { name: 'Dealer\'s Hand', value: dealerCards + '\nTotal: ' + dealerSum, inline: true },
                            )
                            .setColor('5865F2')
                        if (winner == 'player') {
                            newEmbed.setDescription('Du hast gewonnen!')
                            newEmbed.addFields(
                                { name: 'Profit', value: (credits * 2) + ' Credits' },
                                { name: 'Credits', value: 'Du hast jetzt ' + userCredits + ' Credits' }
                            )
                            newEmbed.setColor('57F287')
                            await economy.addCoins(guildId, userId, credits * 2);
                        } else if (winner == 'dealer') {
                            newEmbed.setDescription('Du hast die schlechtere Hand und verlierst alles!')
                            newEmbed.addFields(
                                { name: 'Profit', value: '-' + credits + ' Credits' },
                                { name: 'Credits', value: 'Du hast jetzt ' + userCredits + ' Credits' }
                            )
                            newEmbed.setColor('ED4245')
                        } else if (winner == 'draw') {
                            newEmbed.setDescription('Du hast gleichviel wie der Dealer! Unentschieden!');
                            newEmbed.addFields(
                                { name: 'Profit', value: '0 Credits' },
                                { name: 'Credits', value: 'Du hast jetzt ' + userCredits + ' Credits' }
                            )
                            await economy.addCoins(guildId, userId, credits);
                        }
                        msg.edit({ component: button_finished, embed: newEmbed })
                    } else if (button.id === 'bjHit') {
                        let newCard = randomCard();
                        if ((newCard === 11) & (playerSum > 10)) {
                            newCard = 1;
                        }
                        playerSum = playerSum + newCard
                        playerCards.push(newCard)
                        const newEmbed = new MessageEmbed()
                            .setTitle(`Blackjack - ${user.username}`)
                            .addFields(
                                { name: 'Deine Hand', value: playerCards + '\nTotal: ' + playerSum, inline: true },
                                { name: 'Dealer\'s Hand', value: dealerCard1 + '\nTotal: ' + dealerCard1, inline: true },
                                { name: 'Info', value: '**Stand:** Das Spiel beenden\n**Hit:** Eine weitere Karte ziehen\n**Double:** Doppelter Einsatz, eine Karte ziehen und beenden\n**Fold:** Aufgeben, aber nur die Hälfte des Einsatzes verlieren'}
                            )
                            .setFooter('Das Spiel läuft nach 5 Minuten Inaktivität ab.')
                            .setColor('5865F2');
                        if (playerSum > 21) {
                            const embed_3 = new MessageEmbed()
                                .setTitle(`Blackjack - ${user.username}`)
                                .setDescription('Du hast die schlechtere Hand und verlierst alles!')
                                .addFields(
                                    { name: 'Deine Hand', value: playerCards + '\nTotal: ' + playerSum, inline: true },
                                    { name: 'Dealer\'s Hand', value: dealerCards + '\nTotal: ' + dealerSum, inline: true },
                                    { name: 'Profit', value: '-' + credits + ' Credits' },
                                    { name: 'Credits', value: 'Du hast jetzt ' + userCredits + ' Credits' }
                                )
                                .setColor('ED4245')
                            msg.edit({ component: button_finished, embed: embed_3 })
                        } else {
                            msg.edit({ component: row, embed: newEmbed })
                        }
                    } else if (button.id === 'bjDouble') {
                        let newCard = randomCard();
                        if ((newCard === 11) & (playerSum > 10)) {
                            newCard = 1;
                        }
                        playerSum = playerSum + newCard
                        playerCards.push(newCard)
                        const winner = await checkWinner()
                        const newEmbed = new MessageEmbed()
                            .setTitle(`Blackjack - ${user.username}`)
                            .addFields(
                                { name: 'Deine Hand', value: playerCards + '\nTotal: ' + playerSum, inline: true },
                                { name: 'Dealer\'s Hand', value: dealerCards + '\nTotal: ' + dealerSum, inline: true },
                            )
                            .setColor('5865F2')
                        if (winner == 'player') {
                            newEmbed.setDescription('Du hast gewonnen!')
                            newEmbed.addFields(
                                { name: 'Profit', value: (credits * 2) + ' Credits' },
                                { name: 'Credits', value: 'Du hast jetzt ' + userCredits + ' Credits' }
                            )
                            newEmbed.setColor('57F287')
                            await economy.addCoins(guildId, userId, credits * 2);
                        } else if (winner == 'dealer') {
                            newEmbed.setDescription('Du hast die schlechtere Hand und verlierst alles!')
                            newEmbed.addFields(
                                { name: 'Profit', value: '-' + credits + ' Credits' },
                                { name: 'Credits', value: 'Du hast jetzt ' + userCredits + ' Credits' }
                            )
                            newEmbed.setColor('ED4245')
                        } else if (winner == 'draw') {
                            newEmbed.setDescription('Du hast gleichviel wie der Dealer! Unentschieden!');
                            newEmbed.addFields(
                                { name: 'Profit', value: '0 Credits' },
                                { name: 'Credits', value: 'Du hast jetzt ' + userCredits + ' Credits' }
                            )
                            await economy.addCoins(guildId, userId, credits);
                        }
                        msg.edit({ component: button_finished, embed: newEmbed })
                    } else if (button.id === 'bjFold') {
                        const newEmbed = new MessageEmbed()
                            .setTitle(`Blackjack - ${user.username}`)
                            .setDescription('Du hast aufgegeben und verlierst nur die Hälfte deines Einsatzes!')
                            .addFields(
                                { name: 'Deine Hand', value: playerCards + '\nTotal: ' + playerSum, inline: true },
                                { name: 'Dealer\'s Hand', value: dealerCards + '\nTotal: ' + dealerSum, inline: true },
                                { name: 'Profit', value: '-' + Math.floor(credits / 2 ) + ' Credits' },
                                { name: 'Credits', value: 'Du hast jetzt ' + userCredits + ' Credits'}
                            )
                            .setColor('ED4245')
                        msg.edit({ component: button_finished, embed: newEmbed })
                    }
                }
                collector.on('end', collected => {
                    msg.edit({ component: button_finished})
                })
                collector.on('error', (e) => console.log(e))
            })
        });
        function checkWinner() {
            if (playerSum == dealerSum) {
                return 'draw';
            }
            if (playerSum <= 21) {
                if ((playerSum > dealerSum) & (dealerSum <= 21)) {
                    return 'player';
                } else if (dealerSum > 21) {
                    return 'player';
                }
            }
            return 'dealer';
        }
        return 'Es wird Blackjack gespielt...';
    }
}