const { MessageEmbed } = require("discord.js");
const { MessageButton, MessageActionRow } = require('discord-buttons');
const economy = require('../../features/economy');

module.exports = {
	description: 'Spiele mit einem anderen Servermitglied eine Partie Schere, Stein, Papier!',
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

		const user = client.users.cache.get(userId);
		const target = client.users.cache.get(targetId);

		if (target.bot) return 'Du kannst nicht mit einem Bot spielen!';
		if (userId === targetId) return 'Du kannst doch nicht mit dir selbst spielen!';
		if (credits < 1) return 'Netter Versuch, aber du kannst nicht mit negativen Einsatz spielen!';
		const coinsOwned = await economy.getCoins(guildId, userId);
		if (coinsOwned < credits) return `Du hat nicht genug Credits!`;

		const targetCoins = await economy.getCoins(guildId, targetId);
		if (targetCoins < credits) return `Du kannst ${target.username} nicht herausfordern, da er/sie nicht genug Credits hat!`;
		
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

		const row = new MessageActionRow()
			.addComponents([ buttonScissor, buttonStone, buttonPaper ])

		const row_2 = new MessageActionRow()
			.addComponents([ buttonScissorD, buttonStoneD, buttonPaperD ])
		
		const embed = new MessageEmbed()
			.setTitle('Schere, Stein, Papier')
			.setDescription(`${target} du wurdest zu einem Spiel herausgefordert!\n Klicke den Button "Annehmen" um teilzunehmen!`)
			.addFields(
				{ name: 'Einsatz', value: `\`${credits}\` 💵`, inline: true },
				{ name: 'Herausforderer', value: user, inline: true },
			)
            .setColor('5865F2')
			.setFooter('Du hast 60 Sekunden die Herausforderung anzunehmen!');
	
		const embed2 = new MessageEmbed()
			.setTitle('Schere, Stein, Papier')
			.setDescription('Das Spiel wurde gestartet!\nKlickt beide jeweils ein Button an!')
			.addFields(
				{ name: 'Spieler 1', value: user, inline: true },
				{ name: 'Spieler 2', value: target, inline: true }
			)
            .setColor('5865F2')
		
		channel.send({ component: button, embed: embed }).then(msg => {
			const collector = msg.createButtonCollector((button) => userId == userId, { timeout: 60000 });
	
			collector.on('collect', async button => {
				button.defer();
	
				if (button.id === 'rpsAccept') {
					if (button.clicker.user.id != targetId) return;
					buttonClicked = true;
					msg.edit({
						component: row,
						embed: embed2,
					})
				} else if (button.id === 'rpsScissor') {
					if (button.clicker.user.id === userId) {
						if (!userChoice) {
							userChoice = 'Schere'
							checkUsers(msg)
						}
					} else if (button.clicker.user.id === targetId) {
						if (!targetChoice) {
							targetChoice = 'Schere'
							checkUsers(msg)
						}
					}
				} else if (button.id === 'rpsStone') {
					if (button.clicker.user.id === userId) {
						if (!userChoice) {
							userChoice = 'Stein'
							checkUsers(msg)
						}
					} else if (button.clicker.user.id === targetId) {
						if (!targetChoice) {
							targetChoice = 'Stein'
							checkUsers(msg)
						}
					}
				} else if (button.id === 'rpsPaper') {
					if (button.clicker.user.id === userId) {
						if (!userChoice) {
							userChoice = 'Papier'
							checkUsers(msg)
						}
					} else if (button.clicker.user.id === targetId) {
						if (!targetChoice) {
							targetChoice = 'Papier'
							checkUsers(msg)
						}
					}
				}
			})
			collector.on('end', collected => {
				if (!buttonClicked) {
					msg.edit({ component: buttonTimeout })
				}
			})
			collector.on('error', (e) => console.log(e))
		})
	
		let userChoice; let targetChoice;
	
		async function checkUsers (msg) {
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
					.setColor('5865F2');
				msg.edit({ component: row_2, embed: embed3})
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

		return 'Es wird Schere, Stein, Papier gespielt...';
	},
};