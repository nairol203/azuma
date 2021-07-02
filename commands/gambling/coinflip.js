const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { FeelsBadMan } = require('../../emoji.json');
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
	callback: async ({ client, interaction }) => {
		const userID = interaction.member.user.id;
		const targetID = interaction.options.get('user').value;
		const credits = interaction.options.get('credits').value;

		const target = interaction.options.get('user').user;

		if (targetID == client.user.id) return interaction.reply({ content: '<@255739211112513536> war zu faul, mir beizubringen wie man einen Coinflip spielt. Du wirst dir wohl jemand anderen suchen müssen. ' + FeelsBadMan, ephemeral: true });
        if (target.bot) return interaction.reply({ content: 'Du bist ein paar Jahrzehnte zu früh, Bots können so etwas noch nicht!', ephemeral: true });
        else if (userID == targetID) return interaction.reply({ content: 'Wie willst du denn mit dir selbst spielen??', ephemeral: true });
		if (credits <= 0) return interaction.reply({ content: 'Netter Versuch, aber ich lasse dich nicht mit negativen Einsatz spielen!', ephemeral: true });
		const coinsOwned = await economy.getCoins(userID);
		if (coinsOwned < credits) return interaction.reply({ content: 'Du bist wohl ärmer als du denkst! Versuche es mit weniger Geld.', ephemeral: true });
	
		const targetCoins = await economy.getCoins(targetID);
		if (targetCoins < credits) return interaction.reply({ content: `Soviel Geld hat ${target.username} nicht! Pah! Was ein Geringverdiener...`, ephemeral: true });

		const randomNumber = [1, 2][Math.floor(Math.random() * 2)];
		
		let row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomID('accept')
					.setLabel('Spiel starten')
					.setStyle('SUCCESS')
			);

		interaction.reply({ content: `__**Coinflip**__\n<@${userID}> vs. ${target}\nEinsatz: ${credits} 💵`, components: [row] });

        const message = await interaction.fetchReply()
        const filter = i => i.customID == 'accept' && i.user.id == targetID || userID;

        const collector = message.createMessageComponentInteractionCollector({ filter, time: 300000 });

		collector.on('collect', async button => {
			if (button.user.id !== targetID) {
				await button.reply({ content: `Nur ${target} kann das Spiel starten! Warte, bis er/sie bereit ist.`});
				return;
			};
			row = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomID('accept')
						.setLabel('Spiel gestartet')
						.setStyle('SECONDARY')
						.setDisabled(true),
				);
			await button.update({ components: [row] });
			switch (randomNumber) {
				case 1:
					await button.followUp(`Es ist Kopf! Damit hat <@${targetID}> ${credits} 💵 gewonnen!`)
					await economy.addCoins(targetID, credits);
					await economy.addCoins(userID, credits * -1);
					break;
				case 2:
					await button.followUp(`Es ist Zahl! Damit hat <@${userID}> ${credits} 💵 gewonnen!`);
					await economy.addCoins(targetID, credits * -1);
					await economy.addCoins(userID, credits);
					break;
			};
			collector.stop();
		});
	},
};