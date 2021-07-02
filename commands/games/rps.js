const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { FeelsBadMan } = require('../../emoji.json');

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
		const userID = user.id;

		const target = interaction.options.get('user').user;
		const targetID = interaction.options.get('user').value;

		if (target.id == client.user.id) return interaction.reply({ content: '<@255739211112513536> war zu faul, mir beizubringen wie man Schere Stein Papier spielt. Du wirst dir wohl jemand anderen suchen müssen. ' + FeelsBadMan, ephemeral: true });
        if (target.bot) return interaction.reply({ content: 'Du bist ein paar Jahrzehnte zu früh, Bots können so etwas noch nicht!', ephemeral: true });
        else if (user.id == target.id) return interaction.reply({ content: 'Wie willst du denn mit dir selbst spielen??', ephemeral: true });

		const rowStart = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomID('rpsAccept')
					.setLabel('Spiel starten')
					.setStyle('SUCCESS')
			);

		const rowInGame = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomID('✌️ Schere')
					.setLabel('Schere')
					.setStyle('PRIMARY')
					.setEmoji('✌'),
				new MessageButton()
					.setCustomID('✊ Stein')
					.setLabel('Stein')
					.setStyle('PRIMARY')
					.setEmoji('✊'),
				new MessageButton()
					.setCustomID('🤚 Papier')
					.setLabel('Papier')
					.setStyle('PRIMARY')
					.setEmoji('✋'),
			);

		const rowTimeout = new MessageActionRow()
			.addComponents(
				new MessageButton()	
					.setCustomID('rpsTimeout')
					.setLabel('Spiel beendet')
					.setStyle('SECONDARY')
					.setDisabled(true),
			);

		const embedStart = new MessageEmbed()
			.setTitle('Schere, Stein, Papier')
			.setDescription(`${target}, du wurdest von ${user} zu einer Runde herausgefordert! Starte das Spiel, wenn du bereit bist! Nur du kannst das Spiel starten.`)
			.setFooter('Azuma | Das Spiel läuft nach 5 Minuten aus.', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
            .setColor('5865F2');

		const embedInGame = new MessageEmbed()
			.setTitle('Schere, Stein, Papier')
			.setDescription('Das Spiel wurde gestartet!\nÜberlegt euch gut, was ihr auswählt!')
			.addFields(
				{ name: 'Spieler 1', value: `<@${userID}>`, inline: true },
				{ name: 'Spieler 2', value: `<@${targetID}>`, inline: true }
			)
			.setFooter('Azuma | Contact florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
            .setColor('5865F2')

		interaction.reply({ embeds: [embedStart], components: [rowStart] });

        const message = await interaction.fetchReply()
        const filter = i => i.user.id == userID || i.user.id == targetID;
        const collector = message.createMessageComponentInteractionCollector(filter, { time: 300000 });

		let userChoice; let targetChoice;

		collector.on('collect', async button => {
			if (button.customID == 'rpsAccept') {
				if (button.user.id != targetID) {
					await button.reply({ content: `Nur ${target} kann das Spiel starten! Warte, bis er bereit ist.`, ephemeral: true });
					return;
				};
				button.update({ embeds: [embedInGame], components: [rowInGame] });
			}
			else {
				if (button.user.id == userID) {
					if (!userChoice) {
						await button.reply({ content: `Du hast ${button.customID} ausgewählt!`, ephemeral: true });
						userChoice = button.customID;
					}
					else {
						await button.reply({ content: `Du kannst deine Entscheidung nicht mehr ändern! Deine Wahl war ${userChoice}`, ephemeral: true });
					}
				}
				else if (button.user.id == targetID && !targetChoice) {
					if (!targetChoice) {
						await button.reply({ content: `Du hast ${button.customID} ausgewählt!`, ephemeral: true });
						targetChoice = button.customID;
					}
					else {
						await button.reply({ content: `Du kannst deine Entscheidung nicht mehr ändern! Deine Wahl war ${targetChoice}`, ephemeral: true });
					}
				}
				checkUsers();
			};
		});

		collector.on('end', async () => {
			await interaction.editReply({ components: [rowTimeout] })
		});

		async function checkUsers() {
			if (!userChoice || !targetChoice) return;
			const result = await checkWinner()
			if (result == 'draw') description = `Das Spiel ist beendet!\nEs gibt keinen Gewinner! Unenschieden.`
			else if (result == 'userWin') {
				description = `Das Spiel ist beendet!\n Der Gewinner ist ${user}. Glückwunsch!`;
			}
			else if (result == 'targetWin') {
				description = `Das Spiel ist beendet!\nDer Gewinner ist ${target}. Glückwunsch!`;
			};
			const embed3 = new MessageEmbed()
				.setTitle('Schere, Stein, Papier')
				.setDescription(description)
				.addFields(
					{ name: 'Spieler 1', value: `${user}\n${userChoice}`, inline: true },
					{ name: 'Spieler 2', value: `${target}\n${targetChoice}`, inline: true },
				)
				.setFooter('Azuma | Contact florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
				.setColor('5865F2');
			collector.stop();
			interaction.editReply({ embeds: [embed3] });
		};

		function checkWinner () {	
			if (userChoice == '✌️ Schere' & targetChoice == '✊ Stein') return 'targetWin';
			if (userChoice == '✊ Stein' & targetChoice == '🤚 Papier') return 'targetWin';
			if (userChoice == '🤚 Papier' & targetChoice == '✌️ Schere') return 'targetWin';
			if (userChoice == '✌️ Schere' & targetChoice == '🤚 Papier') return 'userWin';
			if (userChoice == '✊ Stein' & targetChoice == '✌️ Schere') return 'userWin';
			if (userChoice == '🤚 Papier' & targetChoice == '✊ Stein') return 'userWin';
			return 'draw';
		};
	},
};