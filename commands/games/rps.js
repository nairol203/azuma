const { MessageEmbed } = require("discord.js");

module.exports = {
	description: 'Spiele mit einem anderen Servermitglied eine Partie Schere, Stein, Papier!',
	options: [
		{
			name: 'user',
			description: 'Beliebiges Servermitglied',
			type: 6,
			required: true,
		}
	],
	callback: async ({ client, interaction }) => {
		const user = interaction.member.user;
		const userId = user.id;

		const target = interaction.options.get('user').user;
		const targetId = interaction.options.get('user').value;

        if (target.bot) return interaction.reply({ content: 'Du bist ein paar Jahrzehnte zu früh, Bots können sowas noch nicht!', ephemeral: true });
        else if (user.id == target.id) return interaction.reply({ content: 'Wie willst du denn mit dir selbst spielen??', ephemeral: true });

		const button = {
			type: 2,
			label: 'Annehmen',
			style: 1,
			custom_id: 'rpsAccept',
		};

		const buttonTimeout = {
			type: 2,
			label: 'Zeit abgelaufen',
			style: 4,
			custom_id: 'rps0',
			disabled: true,
		};

		const buttonScissor = {
			type: 2,
			label: 'Schere',
			style: 1,
			custom_id: 'rpsScissor',
			emoji: '✌',
		};

		const buttonStone = {
			type: 2,
			label: 'Stein',
			style: 1,
			custom_id: 'rpsStone',
			emoji: '✊',
		};

		const buttonPaper = {
			type: 2,
			label: 'Papier',
			style: 1,
			custom_id: 'rpsPaper',
			emoji: '✋',
		};

		const row = {
			type: 1,
			components: [ buttonScissor, buttonStone, buttonPaper ],
		};

		const row_3 = {
			type: 1,
			components: [ button ],
		};

		const row_4 = {
			type: 1,
			components: [ buttonTimeout ],
		};

		const embed = new MessageEmbed()
			.setTitle('Schere, Stein, Papier')
			.setDescription(`${target} du wurdest zu einem Spiel herausgefordert!\n Klicke den Button "Annehmen" um teilzunehmen!`)
			.addFields(
				{ name: 'Einsatz', value: `\`${credits}\` 💵`, inline: true },
				{ name: 'Herausforderer', value: `<@${userId}>`, inline: true },
			)
			.setFooter('Azuma | Du hast 5 Minuten die Herausforderung anzunehmen!', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
            .setColor('5865F2');

		const embed2 = new MessageEmbed()
			.setTitle('Schere, Stein, Papier')
			.setDescription('Das Spiel wurde gestartet!\nKlickt beide jeweils ein Button an!')
			.addFields(
				{ name: 'Spieler 1', value: `<@${userId}>`, inline: true },
				{ name: 'Spieler 2', value: `<@${targetId}>`, inline: true }
			)
			.setFooter('Azuma | Contact florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
            .setColor('5865F2')

		interaction.reply({ embeds: [embed], components: [row_3] });

        const message = await interaction.fetchReply()
        const filter = i => i.user.id == userId || i.user.id == targetId;

        const collector = message.createMessageComponentInteractionCollector(filter, { time: 300000 });

		collector.on('collect', async button => {
			if (button.customID === 'rpsAccept') {
				if (button.user.id != targetId) return;
				buttonClicked = true;
				button.update({ embeds: [embed2], components: [row] });
			}
			else if (button.customID === 'rpsScissor') {
				if (button.user.id === userId) {
					if (!userChoice) {
						userChoice = 'Schere';
						checkUsers(button);
					}
				}
				else if (button.user.id === targetId) {
					if (!targetChoice) {
						targetChoice = 'Schere';
						checkUsers(button);
					}
				};
			}
			else if (button.customID === 'rpsStone') {
				if (button.user.id === userId) {
					if (!userChoice) {
						userChoice = 'Stein';
						checkUsers(button);
					}
				}
				else if (button.user.id === targetId) {
					if (!targetChoice) {
						targetChoice = 'Stein';
						checkUsers(button);
					}
				};
			} 
			else if (button.customID === 'rpsPaper') {
				if (button.user.id === userId) {
					if (!userChoice) {
						userChoice = 'Papier';
						checkUsers(button);
					}
				}
				else if (button.user.id === targetId) {
					if (!targetChoice) {
						targetChoice = 'Papier';
						checkUsers(button);
					}
				};
			};
		});

		collector.on('end', async () => {
			interaction.editReply({ embed: [embed], components: [row_4] })
		});

		let userChoice; let targetChoice;

		async function checkUsers(button) {
			if (userChoice && targetChoice) {
				const result = checkWinner()
				if (result === 'draw') description = `Das Spiel ist beendet!\nEs gibt keinen Gewinner! Unenschieden.`
				else if (result === 'userWin') {
					description = `Das Spiel ist beendet!\n Der Gewinner ist: ${user}. Glückwunsch!`;
				}
				else if (result === 'targetWin') {
					description = `Das Spiel ist beendet!\nDer Gewinner ist: ${target}. Glückwunsch!`;
				};
				const embed3 = new MessageEmbed()
					.setTitle('Schere, Stein, Papier')
					.setDescription(description)
					.addFields(
						{ name: 'Preis', value: credits * 2 + ' 💵', inline: true },
						{ name: user.username, value: userChoice, inline: true },
						{ name: target.username, value: targetChoice, inline: true },
					)
					.setFooter('Azuma | Contact florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
					.setColor('5865F2');
					buttonPaper.disabled = true;
					buttonScissor.disabled = true;
					buttonStone.disabled = true;
					button.update({ embeds: [embed3], components: [row] });
			};
		};

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
		};
	},
};