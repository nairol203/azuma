const { MessageEmbed, MessageButton } = require("discord.js");
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

		const targetId = interaction.options.get('user').value;
		const credits = interaction.options.get('credits').value;

		const target = interaction.options.get('user').user;

        if (target.bot) return interaction.reply({ content: 'Du bist ein paar Jahrzehnte zu früh, Bots können sowas noch nicht!', ephemeral: true });
        else if (userID == target.id) return interaction.reply({ content: 'Wie willst du denn mit dir selbst spielen??', ephemeral: true });
		if (credits < 1) return interaction.reply({ content: 'Netter Versuch, aber ich lasse dich nicht mit negativen Einsatz spielen!', ephemeral: true });
		const coinsOwned = await economy.getCoins(userID);
		if (coinsOwned < credits) return interaction.reply({ content: 'Du bist wohl ärmer als du denkst! Versuche es mit weniger Geld.', ephemeral: true });
	
		const targetCoins = await economy.getCoins(targetId);
		if (targetCoins < credits) return interaction.reply({ content: `Soviel Geld hat ${target.username} nicht! Pah! Was ein Geringverdiener...`, ephemeral: true });

		const randomNumber = [1, 2][Math.floor(Math.random() * 2)];
	
		const button = new MessageButton()
			.setCustomID('accept')
			.setLabel('Coinflip starten')
			.setStyle('SUCCESS')
		
		const row = {
			type: 1,
			components: [ button ],
		};

		const embed = new MessageEmbed()
			.setTitle('Coinflip')
			.setDescription(`${target}, du wurdest von <@${userID}> zu einem Coinflip herausgefordert! Starte das Spiel, wenn du bereit bist! Nur du kannst das Spiel starten.`)
			.addFields(
				{ name: 'Einsatz', value: credits + ' 💵', inline: true },
			)
			.setColor('#fdb701')
			.setFooter('Azuma | Du hast 5 Minuten die Herausforderung anzunehmen!', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)

		interaction.reply({ embeds: [embed], components: [row] });

        const message = await interaction.fetchReply()
        const filter = i => i.user.id == targetId;

        const collector = message.createMessageComponentInteractionCollector(filter, { time: 300000 });

		collector.on('collect', async button => {
			if (button.customID === 'accept') {
				button.disabled = true;
				button.update({ embeds: [embed], components: [row] });
				switch (randomNumber) {
					case 1:
						button.followUp(`Es ist Kopf! Damit hat <@${targetId}> ${credits} 💵 gewonnen!`)
						await economy.addCoins(targetId, credits);
						await economy.addCoins(userID, credits * -1);
						break;
					case 2:
						button.followUp(`Es ist Zahl! Damit hat <@${userID}> ${credits} 💵 gewonnen!`);
						await economy.addCoins(targetId, credits * -1);
						await economy.addCoins(userID, credits);
						break;
				};
                collector.stop();
			};
		});

		collector.on('end', async () => {
			button.disabled = true;
			interaction.editReply({ components: [row]});
		});
	},
};