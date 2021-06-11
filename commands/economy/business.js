const { MessageEmbed } = require('discord.js');
const { send, edit, get } = require('../../features/slash');
const { yes, no } = require('../../emoji.json');

const { buyUpgrade1, buyUpgrade2, buyUpgrade3 } = require('../../features/business');
const { documents, weed, fakeMoney, meth, cocaine } = require('../../features/business.json');
const business = require('../../features/business');
const cooldowns = require('../../cooldowns');
const economy = require('../../features/economy');
const { addCoins } = require('../../features/economy');

function format(number) {
	const result = Intl.NumberFormat('de-DE', { maximumSignificantDigits: 3 }).format(number);
	return result;
}

function showBar(cd) {
	const progress = (28800 % cd) / 28800;
	const progressOutOf18 = Math.round(progress * 18);

	const barStr = `${'█'.repeat(progressOutOf18)}${'░'.repeat(18 - progressOutOf18)}`;
	return barStr;
}

module.exports = {
	description: 'Verwalte dein eigenes Unternehmen und werde ein angesehener CEO!',
	options: [
		{
			name: 'options',
			description: 'Verwalte dein eigenes Unternehmen und werde ein angesehener CEO!',
			type: 3,
			choices: [
				{
					name: 'sell',
					value: 'sell'
				}
			]
		}
	],
	callback: async ({ client, interaction, args }) => {
		const guildId = interaction.guild_id
		const member = interaction.member;
		const user = member.user;
		const userId = user.id
		const getBusiness = await business.getBusiness(guildId, userId);
		const getCooldown = await cooldowns.getCooldown(userId, 'work');

		if (getBusiness === null) return [ no + ' Du hast kein Unternehmen, kaufe eines im Shop!' ];

		if (args.options === 'sell') {
			const mathCd = await cooldowns.mathCooldown(userId, 'work');
			if (getCooldown) return [ no + ` Du hast noch **${mathCd}** Cooldown!` ];
			const company = await business.setCompany(guildId, userId);
			const profit = await business.checkProfit(guildId, userId);
			
			await economy.addCoins(guildId, userId, profit);
			await cooldowns.setCooldown(userId, 'work', 8 * 60 * 60)
			const embed = new MessageEmbed()
				.setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.webp`)
				.setTitle('Verkauf erfolgreich')
				.setDescription(`Du hast die hergestellte Ware von deiner ${company.name} verkauft.`)
				.addField('Umsatz', `\`${profit}\` 💵`)
				.setFooter('Azuma | Du kannst alle 8 Stunden deine Ware verkaufen.', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
				.setColor('#2f3136');
			return embed;
		}

		const buttonSell = {
			type: 2,
			label: 'Ware verkaufen',
			style: 2,
			custom_id: 'sell',
			disabled: true,
		};
		const buttonUpgrade1 = {
			type: 2,
			label: 'Upgrade 1 kaufen',
			style: 2,
			custom_id: 'buyUpgrade1',
			disabled: true,
		};
		const buttonUpgrade2 = {
			type: 2,
			label: 'Upgrade 2 kaufen',
			style: 2,
			custom_id: 'buyUpgrade2',
			disabled: true,
		};
		const buttonUpgrade3 = {
			type: 2,
			label: 'Upgrade 3 kaufen',
			style: 2,
			custom_id: 'buyUpgrade3',
			disabled: true,
		};
		const buttonNewBusiness = {
			type: 2,
			label: 'Nächstes Business kaufen',
			style: 2,
			custom_id: 'buyNext',
			disabled: true,
		};

		const row = {
			type: 1,
			components: [ buttonSell, buttonUpgrade1, buttonUpgrade2, buttonUpgrade3 ],
		};

		if (getBusiness.upgrade1 & getBusiness.upgrade2 & getBusiness.upgrade3) {
			if (getBusiness.type !== cocaine.name) {
				buttonNewBusiness.style = 3;
				buttonNewBusiness.disabled = false;
			};
			row.components = [ buttonSell, buttonNewBusiness ];
		};

		const company = await business.setCompany(guildId, userId);
		const profit = await business.checkProfit(guildId, userId);

		const up1 = getBusiness.upgrade1 ? yes : no;
		const up2 = getBusiness.upgrade2 ? yes : no;
		const up3 = getBusiness.upgrade3 ? yes : no;

		let cd = '██████████████████\nDein Lager ist voll! Verkaufe die Ware mit `/business: sell`';
		let cooldown;

		if (getCooldown) {
			cooldown = getCooldown;
			cd = showBar(cooldown);
		} 
		else {
			buttonSell.disabled = false;
			buttonSell.style = 3;
		};

		if (!getBusiness.upgrade1) {
			buttonUpgrade1.disabled = false;
			buttonUpgrade1.style = 1;
		};
		if (!getBusiness.upgrade2) {
			buttonUpgrade2.disabled = false;
			;buttonUpgrade2.style = 1;
		}
		if (!getBusiness.upgrade3) {
			buttonUpgrade3.disabled = false;
			buttonUpgrade3.style = 1;
		};

		const embed = new MessageEmbed()
			.setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.webp`)
			.setTitle(getBusiness.type)
			.setDescription('Das ist die Übersicht über dein Unternehmen. Von hier aus kannst du deine Ware verkaufen und neue Upgrades für dein Business kaufen.')
			.addFields(
				{ name: 'Umsatz pro Verkauf', value: `${format(profit)} 💵` },
				{ name: 'Lagerbestand', value: cd },
				{ name: 'Upgrades', value: `${up1} Personalupgrade\n${up2} Besserer Zulieferer\n${up3} ${company.nameUpgrade3}` },
			)
            .setFooter('Azuma | Contact @florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
			.setColor('#2f3136');

		send(client, interaction, embed, row);

        const response = await client.api.webhooks(client.user.id, interaction.token).messages('@original').get();

		client.on('clickButton', async button => {
			button.defer()

			if (response.id !== button.message.id) return;
			if (button.clicker.user.id !== userId) return;

			if (button.id == 'sell') {
				await economy.addCoins(guildId, userId, profit);
				await cooldowns.setCooldown(userId, 'work', 8 * 60 * 60);
				buttonSell.disabled = true;
				buttonSell.style = 2;
				
				const embed = new MessageEmbed()
					.setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.webp`)
					.setTitle(getBusiness.type)
					.setDescription('Das ist die Übersicht über dein Unternehmen. Von hier aus kannst du deine Ware verkaufen und neue Upgrades für dein Business kaufen.')
					.addFields(
						{ name: 'Umsatz pro Verkauf', value: `${format(profit)} 💵` },
						{ name: 'Lagerbestand', value: '░░░░░░░░░░░░░░░░░░\nVerkauf erfolgreich!' },
						{ name: 'Upgrades', value: `${up1} Personalupgrade\n${up2} Besserer Zulieferer\n${up3} ${company.nameUpgrade3}` },
					)
					.setFooter('Azuma | Contact @florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
					.setColor('#2f3136');

				edit(client, interaction, embed, row);
			}
			else if (button.id == 'buyUpgrade1') {
				await buyUpgrade1(guildId, userId, getBusiness.type);
				await addCoins(guildId, userId, company.priceUpgrade1 * -1);
				buttonUpgrade1.style = 2;
				buttonUpgrade1.disabled = true;
				const embed = new MessageEmbed()
					.setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.webp`)
					.setTitle(getBusiness.type)
					.setDescription('Das ist die Übersicht über dein Unternehmen. Von hier aus kannst du deine Ware verkaufen und neue Upgrades für dein Business kaufen.')
					.addFields(
						{ name: 'Umsatz pro Verkauf', value: `${format(profit)} 💵` },
						{ name: 'Lagerbestand', value: cd },
						{ name: 'Upgrades', value: `${yes} Personalupgrade\n${up2} Besserer Zulieferer\n${up3} ${company.nameUpgrade3}` },
					)
					.setFooter('Azuma | Contact @florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
					.setColor('#2f3136');
				edit(client, interaction, embed, row);
			}
			else if (button.id == 'buyUpgrade2') {
				await buyUpgrade2(guildId, userId, getBusiness.type);
				await addCoins(guildId, userId, company.priceUpgrade2 * -1);
				buttonUpgrade2.style = 2;
				buttonUpgrade2.disabled = true;
				const embed = new MessageEmbed()
					.setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.webp`)
					.setTitle(getBusiness.type)
					.setDescription('Das ist die Übersicht über dein Unternehmen. Von hier aus kannst du deine Ware verkaufen und neue Upgrades für dein Business kaufen.')
					.addFields(
						{ name: 'Umsatz pro Verkauf', value: `${format(profit)} 💵` },
						{ name: 'Lagerbestand', value: cd },
						{ name: 'Upgrades', value: `${up1} Personalupgrade\n${yes} Besserer Zulieferer\n${up3} ${company.nameUpgrade3}` },
					)
					.setFooter('Azuma | Contact @florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
					.setColor('#2f3136');
				edit(client, interaction, embed, row);
			}
			else if (button.id == 'buyUpgrade3') {
				await buyUpgrade3(guildId, userId, getBusiness.type);
				await addCoins(guildId, userId, company.priceUpgrade3 * -1);
				buttonUpgrade3.style = 2;
				buttonUpgrade3.disabled = true;
				const embed = new MessageEmbed()
					.setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.webp`)
					.setTitle(getBusiness.type)
					.setDescription('Das ist die Übersicht über dein Unternehmen. Von hier aus kannst du deine Ware verkaufen und neue Upgrades für dein Business kaufen.')
					.addFields(
						{ name: 'Umsatz pro Verkauf', value: `${format(profit)} 💵` },
						{ name: 'Lagerbestand', value: cd },
						{ name: 'Upgrades', value: `${up1} Personalupgrade\n${up2} Besserer Zulieferer\n${yes} ${company.nameUpgrade3}` },
					)
					.setFooter('Azuma | Contact @florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
					.setColor('#2f3136');
				edit(client, interaction, embed, row);
			}
			else if (button.id == 'buyNew') {
				if (getBusiness.type == documents.name) {
					company = documents;
				}
				else if (getBusiness.type == weed.name) {
					company = meth;
				}
				else if (getBusiness.type == fakeMoney.name) {
					company = fakeMoney;
				}
				else if (getBusiness.type == meth.name) {
					company = meth;
				};
				await buyBusiness(guildId, userId, company.name);
				await addCoins(guildId, userId, company.price * -1);
				const newProfit = await business.checkProfit(guildId, userId);
				const embed = new MessageEmbed()
					.setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.webp`)
					.setTitle(company.name)
					.setDescription('Das ist die Übersicht über dein Unternehmen. Von hier aus kannst du deine Ware verkaufen und neue Upgrades für dein Business kaufen.')
					.addFields(
						{ name: 'Umsatz pro Verkauf', value: `${format(newProfit)} 💵` },
						{ name: 'Lagerbestand', value: cd },
						{ name: 'Upgrades', value: `${no} Personalupgrade\n${no} Besserer Zulieferer\n${no} ${company.nameUpgrade3}` },
					)
					.setFooter('Azuma | Contact @florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
					.setColor('#2f3136');
				row.components = [ buttonSell, buttonUpgrade1, buttonUpgrade2, buttonUpgrade3 ];
				edit(client, interaction, embed, row);
			};
		})
	},
};