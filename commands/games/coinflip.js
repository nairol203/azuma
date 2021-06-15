const { MessageEmbed } = require("discord.js");
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
		const userId = interaction.member.user.id;

		const targetId = interaction.options.get('user').value;
		const credits = interaction.options.get('credits').value;

		const target = interaction.options.get('user').user;

        if (target.bot) return interaction.reply({ content: 'Du bist ein paar Jahrzehnte zu früh, Bots können sowas noch nicht!', ephemeral: true });
        else if (userId == target.id) return interaction.reply({ content: 'Wie willst du denn mit dir selbst spielen??', ephemeral: true });
		if (credits < 1) return interaction.reply({ content: 'Netter Versuch, aber ich lasse dich nicht mit negativen Einsatz spielen!', ephemeral: true });
		const coinsOwned = await economy.getCoins(userId);
		if (coinsOwned < credits) return interaction.reply({ content: 'Du bist wohl ärmer als du denkst! Versuche es mit weniger Geld.', ephemeral: true });
	
		const targetCoins = await economy.getCoins(targetId);
		if (targetCoins < credits) return interaction.reply({ content: `Soviel Geld hat ${target.username} nicht! Pah! Was ein Geringverdiener...`, ephemeral: true });

		const randomNumber = [1, 2][Math.floor(Math.random() * 2)];
	
		const button = {
			type: 2,
			label: 'Annehmen',
			style: 1,
			custom_id: 'accept',
		};

		const embed = new MessageEmbed()
			.setTitle('Coinflip')
			.setDescription(`<@${targetId}>, du wurdest zu einem Coinflip herausgefordert!\nKlicke den Button "Annehmen" um teilzunehmen!`)
			.addFields(
				{ name: 'Einsatz', value: credits + ' 💵', inline: true },
				{ name: 'Herausforderer', value: `<@${userId}>`, inline: true },
			)
			.setColor('#fdb701')
			.setFooter('Azuma | Du hast 5 Minuten die Herausforderung anzunehmen!', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
	
		const row = {
			type: 1,
			components: [ button ],
		};

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
						button.followUp(`<@${targetId}> hat ${credits * 2} 💵 gewonnen!`)
						await economy.addCoins(targetId, credits);
						await economy.addCoins(userId, credits * -1);
						break;
					case 2:
						button.followUp(`<@${userId}> hat ${credits * 2} 💵 gewonnen!`);
						await economy.addCoins(targetId, credits * -1);
						await economy.addCoins(userId, credits);
						break;
				};
			};
		});

		collector.on('end', async () => {
			button.disabled = true;
			interaction.editReply({ embed: [embed], components: [row]});
		});
	},
};