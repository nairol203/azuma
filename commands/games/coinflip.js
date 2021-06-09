const { MessageEmbed } = require("discord.js");
const { send, edit, error } = require('../../features/slash');
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

		if (target.bot) return error(client, interaction, 'Du kannst nicht mit einem Bot spielen!');
		if (userId === targetId) return error(client, interaction, 'Du kannst doch nicht mit dir selbst spielen!');
		if (credits < 1) return error(client, interaction, 'Netter Versuch, aber du kannst nicht mit negativen Einsatz spielen!');
		const coinsOwned = await economy.getCoins(guildId, userId);
		if (coinsOwned < credits) return error(client, interaction, `Du hast doch gar keine ${credits} 💵!`);
	
		const randomNumber = [1, 2][Math.floor(Math.random() * 2)];
	
		const button = {
			type: 2,
			label: 'Annehmen',
			style: 1,
			custom_id: 'accept',
		};
	
		const buttonDisabled = {
			type: 2,
			label: 'Angenommen',
			style: 3,
			custom_id: '0',
			disabled: true,
		};
	
		const buttonTimeout = {
			type: 2,
			label: 'Zeit abgelaufen',
			style: 4,
			custom_id: '0',
			disabled: true,
		};

		const embed = new MessageEmbed()
			.setTitle('Coinflip')
			.setDescription(`<@${targetId}>, du wurdest zu einem Coinflip herausgefordert!\nKlicke den Button "Annehmen" um teilzunehmen!`)
			.addFields(
				{ name: 'Einsatz', value: credits + ' 💵', inline: true },
				{ name: 'Herausforderer', value: `<@${userId}>`, inline: true },
			)
			.setColor('#fdb701')
			.setFooter('Azuma | Du hast 60 Sekunden die Herausforderung anzunehmen!', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
	
		const row = {
			type: 1,
			components: [ button ],
		};

		const row_2 = {
			type: 1,
			components: [ buttonDisabled ],
		};

		const row_3 = {
			type: 1,
			components: [ buttonTimeout ],
		};

		send(client, interaction, embed, row);

		const response = await client.api.webhooks(client.user.id, interaction.token).messages('@original').get();

		let buttonClicked;

		client.on('clickButton', async button => {
			button.defer();

			if (response.id !== button.message.id) return;
            if (button.clicker.user.id !== userId) return;

			if (button.id === 'accept') {
				buttonClicked = true;
				edit(client, interaction, embed, row_2);
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
		})

		setTimeout(() => {
			if (!buttonClicked) {
				edit(client, interaction, embed, row_3);
			}
		}, 60000);
	},
};