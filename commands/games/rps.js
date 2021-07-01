const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

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

        if (target.bot) return interaction.reply({ content: 'Du bist ein paar Jahrzehnte zu früh, Bots können sowas noch nicht!', ephemeral: true });
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
					.setCustomID('rpsScissor')
					.setLabel('Schere')
					.setStyle('PRIMARY')
					.setEmoji('✌'),
				new MessageButton()
					.setCustomID('rpsStone')
					.setLabel('Stein')
					.setStyle('PRIMARY')
					.setEmoji('✊'),
				new MessageButton()
					.setCustomID('rpsPaper')
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
			if (button.customID === 'rpsAccept') {
				if (button.user.id != targetID) return;
				button.update({ embeds: [embedInGame], components: [rowInGame] });
			}
			else {
				processAnswer(button);
			};
		});

		collector.on('end', async () => {
			interaction.editReply({ components: [rowTimeout] })
		});

		async function processAnswer(button) {
			if (button.user.id == userID && !userChoice) {
				const embed = new MessageEmbed()
					.setTitle('Schere, Stein, Papier')
					.setDescription('Das Spiel wurde gestartet!\nSpieler 1 hat eine Entscheidung getroffen!')
					.addFields(
						{ name: 'Spieler 1', value: `<@${userID}>`, inline: true },
						{ name: 'Spieler 2', value: `<@${targetID}>`, inline: true }
					)
					.setFooter('Azuma | Contact florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
					.setColor('5865F2')
				await button.update({ embeds: [embed], components: [rowInGame] });
				userChoice = button.customID;
			}
			else if (button.user.id == targetID && !targetChoice) {
				const embed = new MessageEmbed()
					.setTitle('Schere, Stein, Papier')
					.setDescription('Das Spiel wurde gestartet!\nSpieler 2 hat eine Entscheidung getroffen!')
					.addFields(
						{ name: 'Spieler 1', value: `<@${userID}>`, inline: true },
						{ name: 'Spieler 2', value: `<@${targetID}>`, inline: true }
					)
					.setFooter('Azuma | Contact florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
					.setColor('5865F2')
				await button.update({ embeds: [embed], components: [rowInGame] });
				targetChoice = button.customID;
			}
			checkUsers();
		}

		async function checkUsers() {
			if (!userChoice || !targetChoice) return;
			const result = await checkWinner()
			if (result === 'draw') description = `Das Spiel ist beendet!\nEs gibt keinen Gewinner! Unenschieden.`
			else if (result === 'userWin') {
				description = `Das Spiel ist beendet!\n Der Gewinner ist ${user}. Glückwunsch!`;
			}
			else if (result === 'targetWin') {
				description = `Das Spiel ist beendet!\nDer Gewinner ist ${target}. Glückwunsch!`;
			};
			await formatChoices()
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
			if (userChoice === 'rpsScissor' & targetChoice === 'rpsStone') return 'targetWin';
			if (userChoice === 'rpsStone' & targetChoice === 'rpsPaper') return 'targetWin';
			if (userChoice === 'rpsPaper' & targetChoice === 'rpsScissor') return 'targetWin';
			if (userChoice === 'rpsScissor' & targetChoice === 'rpsPaper') return 'userWin';
			if (userChoice === 'rpsStone' & targetChoice === 'rpsScissor') return 'userWin';
			if (userChoice === 'rpsPaper' & targetChoice === 'rpsStone') return 'userWin';
			return 'draw';
		};

		function formatChoices() {
			if (userChoice == 'rpsScissor') userChoice = '✌️ Schere';
			if (userChoice == 'rpsStone') userChoice = '✊ Stein';
			if (userChoice == 'rpsPaper') userChoice = '🤚 Papier';
			if (targetChoice == 'rpsScissor') targetChoice = '✌️ Schere';
			if (targetChoice == 'rpsStone') targetChoice = '✊ Stein';
			if (targetChoice == 'rpsPaper') targetChoice = '🤚 Papier';
		}
	},
};