const { MessageEmbed } = require("discord.js");
const { MessageButton } = require('discord-buttons');
const { coin } = require('../../emoji.json');
const economy = require('../../features/economy');

module.exports = {
	description: 'Mache mit einem anderen User einen Coinflip!',
	options: [
		{
			name: 'user',
			description: 'Beliebiges Servermitglied',
			type: 6,
			required: true,
		},
		{
			name: 'credits',
			description: 'Beliebige Anzahl an Credits',
			type: 4,
			required: true,
		},
	],
	callback: async ({ client, args, interaction }) => {
		const guildId = interaction.guild_id;
		const userId = interaction.member.user.id;
		const channel = client.channels.cache.get(interaction.channel_id);

		const targetId = args.user;
		const credits = args.credits;

		const target = client.users.cache.get(targetId);

		if (target.bot) return 'Du kannst nicht mit einem Bot spielen!';
		if (userId === targetId) return 'Du kannst doch nicht mit dir selbst spielen!';
		if (credits < 1) return 'Netter Versuch, aber du kannst nicht mit negativen Einsatz spielen!';
		const coinsOwned = await economy.getCoins(guildId, userId);
		if (coinsOwned < credits) return `Du hast doch gar keine ${credits} 💵!`;
	
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
	
		channel.send({ button: button, embed: embed }).then(msg => {
			const collector = msg.createButtonCollector((button) => targetId == targetId, { tine: 60000});
	
			collector.on('collect', async button => {
				button.defer();
				
				if (button.clicker.user.id == targetId) {
					if (button.id === 'accept') {
						buttonClicked = true;
						msg.edit({
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
				}
			})
			collector.on('end', collected => {
				if (!buttonClicked) {
					msg.edit({ button: buttonTimeout })
				}
			})
			collector.on('error', (e) => console.log(e))
		})

		return 'Es wird eine Münze geworfen...'
	},
};