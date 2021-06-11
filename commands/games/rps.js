const { MessageEmbed } = require("discord.js");
const { send, edit, error } = require('../../features/slash');
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

		const targetId = args.user;
		const credits = args.credits;

		const user = client.users.cache.get(userId);
		const target = client.users.cache.get(targetId);

		if (target.bot) return error(client, interaction, 'Du bist ein paar Jahrzehnte zu früh, Bots können sowas noch nicht!');
		if (userId === targetId) return error(client, interaction, 'Wie willst du denn mit dir selbst spielen??');
		if (credits < 1) return error(client, interaction, 'Netter Versuch, aber du kannst nicht mit negativen Einsatz spielen!');
		const coinsOwned = await economy.getCoins(guildId, userId);
		if (coinsOwned < credits) return error(client, interaction, `Du bist ärmer als du denkst! Versuche es mit weniger Geld.`);

		const targetCoins = await economy.getCoins(guildId, targetId);
		if (targetCoins < credits) return error(client, interaction, `Soviel Geld hat ${target.username} nicht! Pah! Was ein Geringverdiener...`);
		
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
		};
		
		const buttonStone = {
			type: 2,
			label: 'Stein',
			style: 1,
			custom_id: 'rpsStone',
		};
		
		const buttonPaper = {
			type: 2,
			label: 'Papier',
			style: 1,
			custom_id: 'rpsPaper',
		};
		
		const buttonScissorD = {
			type: 2,
			label: 'Schere',
			style: 1,
			custom_id: 'rpsScissor',
			disabled: true,
		};
		
		const buttonStoneD = {
			type: 2,
			label: 'Stein',
			style: 1,
			custom_id: 'rpsStone',
			disabled: true,
		};
		
		const buttonPaperD = {
			type: 2,
			label: 'Papier',
			style: 1,
			custom_id: 'rpsPaper',
			disabled: true,
		};

		const row = {
			type: 1,
			components: [ buttonScissor, buttonStone, buttonPaper ],
		};

		const row_2 = {
			type: 1,
			components: [ buttonScissorD, buttonStoneD, buttonPaperD ],
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
				{ name: 'Herausforderer', value: user, inline: true },
			)
			.setFooter('Azuma | Du hast 5 Minuten die Herausforderung anzunehmen!', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
            .setColor('5865F2');
	
		const embed2 = new MessageEmbed()
			.setTitle('Schere, Stein, Papier')
			.setDescription('Das Spiel wurde gestartet!\nKlickt beide jeweils ein Button an!')
			.addFields(
				{ name: 'Spieler 1', value: user, inline: true },
				{ name: 'Spieler 2', value: target, inline: true }
			)
			.setFooter('Azuma | Contact florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
            .setColor('5865F2')
		
		send(client, interaction, embed, row_3);

		const response = await client.api.webhooks(client.user.id, interaction.token).messages('@original').get();

		client.on('clickButton', async button => {
			button.defer();

			if (response.id !== button.message.id) return;
			
            setTimeout(() => {
				edit(client, interaction, embed, row_4)
				return;
            }, 300000);

			if (button.id === 'rpsAccept') {
				if (button.clicker.user.id != targetId) return;
				buttonClicked = true;
				edit(client, interaction, embed2, row);
			}
			else if (button.id === 'rpsScissor') {
				if (button.clicker.user.id === userId) {
					if (!userChoice) {
						userChoice = 'Schere';
						checkUsers();
					}
				}
				else if (button.clicker.user.id === targetId) {
					if (!targetChoice) {
						targetChoice = 'Schere';
						checkUsers();
					}
				};
			}
			else if (button.id === 'rpsStone') {
				if (button.clicker.user.id === userId) {
					if (!userChoice) {
						userChoice = 'Stein';
						checkUsers();
					}
				}
				else if (button.clicker.user.id === targetId) {
					if (!targetChoice) {
						targetChoice = 'Stein';
						checkUsers();
					}
				};
			} 
			else if (button.id === 'rpsPaper') {
				if (button.clicker.user.id === userId) {
					if (!userChoice) {
						userChoice = 'Papier';
						checkUsers();
					}
				}
				else if (button.clicker.user.id === targetId) {
					if (!targetChoice) {
						targetChoice = 'Papier';
						checkUsers();
					}
				};
			};
		});

		let userChoice; let targetChoice;
	
		async function checkUsers () {
			if (userChoice && targetChoice) {
				const result = checkWinner()
				if (result === 'draw') description = `Das Spiel ist beendet!\nEs gibt keinen Gewinner! Unenschieden.`
				else if (result === 'userWin') {
					description = `Das Spiel ist beendet!\n Der Gewinner ist: ${user}. Glückwunsch!`;
					await economy.addCoins(guildId, userId, credits);
					await economy.addCoins(guildId, targetId, credits * -1);
				}
				else if (result === 'targetWin') {
					description = `Das Spiel ist beendet!\nDer Gewinner ist: ${target}. Glückwunsch!`;
					await economy.addCoins(guildId, userId, credits * -1);
					await economy.addCoins(guildId, targetId, credits);
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
				edit(client, interaction, embed3, row_2);
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