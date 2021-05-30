const { MessageButton } = require('discord-buttons');
const { MessageEmbed } = require('discord.js');
const economy = require('./economy');

module.exports.rps = async (client, args, interaction) => {
    const guildId = interaction.guild_id;
    const userId = interaction.member.user.id;
    const channel = client.channels.cache.get(interaction.channel_id);

    const targetId = args.user;
    const credits = args.credits;

    const user = client.users.cache.get(userId);
    const target = client.users.cache.get(targetId);

    const button = new MessageButton()
		.setStyle('blurple')
		.setLabel('Annehmen')
		.setID('rpsAccept');

    const buttonTimeout = new MessageButton()
		.setStyle('red')
		.setLabel('Zeit abgelaufen')
		.setID('rps0')
        .setDisabled(true);
    
    const buttonScissor = new MessageButton()
		.setStyle('blurple')
		.setLabel('Schere')
		.setID('rpsScissor')
    
    const buttonStone = new MessageButton()
		.setStyle('blurple')
		.setLabel('Stein')
		.setID('rpsStone')
    
    const buttonPaper = new MessageButton()
		.setStyle('blurple')
		.setLabel('Papier')
		.setID('rpsPaper')
    
    const buttonScissorD = new MessageButton()
		.setStyle('gray')
		.setLabel('Schere')
		.setID('rpsScissor')
        .setDisabled(true);
    
    const buttonStoneD = new MessageButton()
		.setStyle('gray')
		.setLabel('Stein')
		.setID('rpsStone')
        .setDisabled(true);
    
    const buttonPaperD = new MessageButton()
		.setStyle('gray')
		.setLabel('Papier')
		.setID('rpsPaper')
        .setDisabled(true);
    
    const embed = new MessageEmbed()
        .setTitle('Schere, Stein, Papier')
        .setDescription(`${target} du wurdest zu einem Spiel herausgefordert!\n Klicke den Button "Annehmen" um teilzunehmen!`)
        .addFields(
            { name: 'Einsatz', value: `\`${credits}\` 💵`, inline: true },
            { name: 'Herausforderer', value: user, inline: true },
        )
        .setFooter('Du hast 60 Sekunden die Herausforderung anzunehmen!');

    const embed2 = new MessageEmbed()
        .setTitle('Schere, Stein, Papier')
        .setDescription('Das Spiel wurde gestartet!\nKlickt beide jeweils ein Button an!')
        .addFields(
            { name: 'Spieler 1', value: user, inline: true },
            { name: 'Spieler 2', value: target, inline: true }
        )
    
    let message;
    channel.send({ button: button, embed: embed }).then(msg => message = msg)

    let userChoice; let targetChoice;

    client.on('clickButton', async (button) => {
        if (button.id === 'rpsAccept') {
            if (button.clicker.user.id != targetId) return;
            button.defer()
            buttonClicked = true;
            message.edit({
                buttons: [  buttonScissor, buttonStone, buttonPaper ],
                embed: embed2,
            })
        } else if (button.id === 'rpsScissor') {
            button.defer()
            if (button.clicker.user.id === userId) {
                if (!userChoice) {
                    userChoice = 'Schere'
                    checkUsers()
                }
            } else if (button.clicker.user.id === targetId) {
                if (!targetChoice) {
                    targetChoice = 'Schere'
                    checkUsers()
                }
            }
        } else if (button.id === 'rpsStone') {
            button.defer()
            if (button.clicker.user.id === userId) {
                if (!userChoice) {
                    userChoice = 'Stein'
                    checkUsers()
                }
            } else if (button.clicker.user.id === targetId) {
                if (!targetChoice) {
                    targetChoice = 'Stein'
                    checkUsers()
                }
            }
        } else if (button.id === 'rpsPaper') {
            button.defer()
            if (button.clicker.user.id === userId) {
                if (!userChoice) {
                    userChoice = 'Papier'
                    checkUsers()
                }
            } else if (button.clicker.user.id === targetId) {
                if (!targetChoice) {
                    targetChoice = 'Papier'
                    checkUsers()
                }
            }
        }
    });
    async function checkUsers () {
        if (userChoice && targetChoice) {
            const result = checkWinner()
            if (result === 'draw') description = `Das Spiel ist beendet!\nEs gibt keinen Gewinner! Unenschieden.`
            if (result === 'userWin') {
                description = `Das Spiel ist beendet!\n Der Gewinner ist: ${user}. Glückwunsch!`;
                await economy.addCoins(guildId, userId, credits);
                await economy.addCoins(guildId, targetId, credits * -1);
            }
            if (result === 'targetWin') {
                description = `Das Spiel ist beendet!\nDer Gewinner ist: ${target}. Glückwunsch!`;
                await economy.addCoins(guildId, userId, credits * -1);
                await economy.addCoins(guildId, targetId, credits);
            }
            const embed3 = new MessageEmbed()
                .setTitle('Schere, Stein, Papier')
                .setDescription(description)
                .addFields(
                    { name: 'Preis', value: credits * 2 + ' 💵', inline: true },
                    { name: user.username, value: userChoice, inline: true },
                    { name: target.username, value: targetChoice, inline: true },
                )
            message.edit({ buttons: [ buttonScissorD, buttonStoneD, buttonPaperD ], embed: embed3})
        }
    }
    function checkWinner () {
        if (userChoice === 'Schere' & targetChoice === 'Schere') return 'draw';
        if (userChoice === 'Stein' & targetChoice === 'Stein') return 'draw';
        if (userChoice === 'Papier' & targetChoice === 'Papier') return 'draw';

        if (userChoice === 'Schere' & targetChoice === 'Stein') return 'targetWin';
        if (userChoice === 'Stein' & targetChoice === 'Papier') return 'targetWin';
        if (userChoice === 'Papier' & targetChoice === 'Schere') return 'targetWin';

        if (userChoice === 'Schere' & targetChoice === 'Papier') return 'userWin';
        if (userChoice === 'Stein' & targetChoice === 'Schere') return 'userWin';
        if (userChoice === 'Papier' & targetChoice === 'Stein') return 'userWin';
    }
    setTimeout(() => {
        if (!buttonClicked) {
            message.edit({
                button: buttonTimeout,
                embed: embed,
            })
        }
    }, 60 * 1000);
}