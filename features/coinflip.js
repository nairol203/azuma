const { MessageButton } = require('discord-buttons');
const { MessageEmbed } = require('discord.js');
const economy = require('./economy');
const { coin } = require('../emoji.json');

module.exports.coinflip = (client, args, interaction) => {
    const guildId = interaction.guild_id;
    const userId = interaction.member.user.id;
    const channel = client.channels.cache.get(interaction.channel_id);

    const targetId = args.user;
    const credits = args.credits;

    const randomNumber = [1, 2][Math.floor(Math.random() * 2)];

    const button = new MessageButton()
		.setStyle('blurple')
		.setLabel('Annehmen')
		.setID('accept');

    const buttonDisabled = new MessageButton()
		.setStyle('green')
		.setLabel('Angenommen')
		.setID('0')
        .setDisabled(true);

    const buttonTimeout = new MessageButton()
		.setStyle('red')
		.setLabel('Zeit abgelaufen')
		.setID('0')
        .setDisabled(true);

    const embed = new MessageEmbed()
        .setTitle('Coinflip')
        .setDescription(`<@${targetId}>, du wurdest zu einem Coinflip herausgefordert!\nKlicke den Button "Annehmen" um teilzunehmen!`)
        .addFields(
            { name: 'Einsatz', value: credits + ' 💵', inline: true },
            { name: 'Herausforderer', value: `<@${userId}>`, inline: true },
        )
        .setColor('#fdb701')
        .setFooter('Du hast 60 Sekunden die Herausforderung anzunehmen!')

    let message;
	channel.send({
		button: button,
        embed: embed,
	}).then(msg => message = msg)
    let buttonClicked;
    client.on('clickButton', async (button) => {
        if (button.id === 'accept') {
            if (button.clicker.user.id != targetId) return;
            button.defer()
            buttonClicked = true;
            message.edit({
                button: buttonDisabled,
                embed: embed,
            })
            const targetCoins = await economy.getCoins(guildId, targetId);
            if (targetCoins < args[1]) return channel.send(`Du kannst nicht teilnehmen da du keine ${args[1]} 💵 hast.`);
            channel.send(coin + ' *flipping...*');
            setTimeout(async function() {
                switch (randomNumber) {
                    case 1:
                        channel.send(`<@${targetId}> hat ${credits} 💵 gewonnen!`);
                        await economy.addCoins(guildId, targetId, credits);
                        await economy.addCoins(guildId, userId, credits * -1);
                        break;
                    case 2:
                        channel.send(`<@${userId}> hat ${credits} 💵 gewonnen!`);
                        await economy.addCoins(guildId, targetId, credits * -1);
                        await economy.addCoins(guildId, userId, credits);
                        break;
                };
            }, 1500);
        }
    });
    setTimeout(() => {
        if (!buttonClicked) {
            message.edit({
                button: buttonTimeout,
                embed: embed,
            })
        }
    }, 60 * 1000);
}