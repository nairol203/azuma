const { MessageEmbed } = require('discord.js');
const { yes, no } = require('../../emoji.json');

const { buyUpgrade1, buyUpgrade2, buyUpgrade3, buyBusiness } = require('../../features/business');
const { documents, weed, fakeMoney, meth, cocaine } = require('../../features/business.json');
const business = require('../../features/business');
const cooldowns = require('../../cooldowns');
const economy = require('../../features/economy');
const { addCoins, getCoins } = require('../../features/economy');

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
	callback: async ({ client, interaction }) => {
		const guildId = interaction.guildID;
		const channel = client.channels.cache.get(interaction.channelID);
		const member = interaction.member;
		const user = member.user;
		const userId = user.id
		let getBusiness = await business.getBusiness(guildId, userId);
		const getCooldown = await cooldowns.getCooldown(userId, 'work');
		const userBal = await getCoins(guildId, userId);

		if (getBusiness === null) {
			const buyFirst = {
				type: 2,
				label: 'Erstes Unternehmen kaufen',
				style: 2,
				custom_id: 'buyFirst',
				disabled: true,
			};
			const row = {
				type: 1,
				components: [buyFirst],
			};

			if (userBal > documents.price) {
				buyFirst.disabled = false;
				buyFirst.style = 3;
			}
			interaction.reply({ content: `Sieht so aus, als hättest du noch kein Unternehmen! Das erste Business ist die ${documents.name}! Sie kostet ${format(documents.price)} 💵\nMöchtest du sie kaufen?`, components: [row], ephemeral: true });
	
			channel.awaitMessageComponentInteraction(i => i.user.id == userId, { time: 300000 })
				.then(async button => {
					if (button.customID == 'buyFirst') {
						await buyBusiness(guildId, userId, documents.name);
						await addCoins(guildId, userId, documents.price * -1);
						buyFirst.disabled = true;
						buyFirst.label = 'Kauf erfolgreich!';
						await cooldowns.setCooldown(userId, 'work', 8 * 60 * 60);
						button.update({ components: [row] });
					}
				})
				.catch(() => {
					buyFirst.disabled = true;
					buyFirst.label = 'Zeit abgelaufen!';
					buyFirst.style = 4;
					interaction.editReply({ components: [row] });
				});
			return;
		};

		if (interaction?.options?.get('options')?.value) {
			const mathCd = await cooldowns.mathCooldown(userId, 'work');
			if (getCooldown) return interaction.reply({ content: `Du hast noch **${mathCd}** Cooldown!`, ephemeral: true });
			let company = await business.setCompany(guildId, userId);
			let profit = await business.checkProfit(guildId, userId);
			
			await economy.addCoins(guildId, userId, profit);
			await cooldowns.setCooldown(userId, 'work', 8 * 60 * 60)
			const embed = new MessageEmbed()
				.setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.webp`)
				.setTitle('Verkauf erfolgreich')
				.setDescription(`Du hast die hergestellte Ware von deiner ${company.name} verkauft.`)
				.addField('Umsatz', `${profit} 💵`)
				.setFooter('Azuma | Du kannst alle 8 Stunden deine Ware verkaufen.', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
				.setColor('#2f3136');
			interaction.reply({ embeds: [embed] });
			return;
		}

		let company = await business.setCompany(guildId, userId);

		const buttonSell = {
			type: 2,
			label: 'Ware verkaufen',
			style: 2,
			custom_id: 'sell',
			disabled: true,
		};
		const buttonUpgrade1 = {
			type: 2,
			label: 'Personalupgrade',
			style: 2,
			custom_id: 'buyUpgrade1',
			disabled: true,
		};
		const buttonUpgrade2 = {
			type: 2,
			label: 'Besserer Zulieferer',
			style: 2,
			custom_id: 'buyUpgrade2',
			disabled: true,
		};
		const buttonUpgrade3 = {
			type: 2,
			label: company.nameUpgrade3,
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

		let nextBusiness;
		if (getBusiness.type == documents.name) {
			nextBusiness = weed;
		}
		else if (getBusiness.type == weed.name) {
			nextBusiness = fakeMoney;
		}
		else if (getBusiness.type == fakeMoney.name) {
			nextBusiness = meth;
		}
		else if (getBusiness.type == meth.name) {
			nextBusiness = cocaine;
		};

		if (getBusiness.upgrade1 & getBusiness.upgrade2 & getBusiness.upgrade3) {
			if (getBusiness.type !== cocaine.name && nextBusiness.price < userBal) {
				buttonNewBusiness.style = 1;
				buttonNewBusiness.disabled = false;
			};
			row.components = [ buttonSell, buttonNewBusiness ];
		};

		let profit = await business.checkProfit(guildId, userId);

		let up1 = getBusiness.upgrade1 ? yes : no;
		let up2 = getBusiness.upgrade2 ? yes : no;
		let up3 = getBusiness.upgrade3 ? yes : no;

		let cd = '██████████████████\nDein Lager ist voll! Es kann keine neue Ware produziert werden!';
		let cooldown;

		if (getCooldown) {
			cooldown = getCooldown;
			cd = showBar(cooldown);
		} 
		else {
			buttonSell.disabled = false;
			buttonSell.style = 3;
		};

		if (!getBusiness.upgrade1 && company.priceUpgrade1 < userBal) {
			buttonUpgrade1.disabled = false;
			buttonUpgrade1.style = 1;
		};
		if (!getBusiness.upgrade2 && company.priceUpgrade2 < userBal) {
			buttonUpgrade2.disabled = false;
			buttonUpgrade2.style = 1;
		}
		if (!getBusiness.upgrade3 && company.priceUpgrade3 < userBal) {
			buttonUpgrade3.disabled = false;
			buttonUpgrade3.style = 1;
		};

		const embed = new MessageEmbed()
			.setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.webp`)
			.setTitle(getBusiness.type)
			.setDescription('Das ist die Übersicht über dein Unternehmen. Von hier aus kannst du deine Ware verkaufen und neue Upgrades für dein Business kaufen.')
			.addFields(
				{ name: 'Umsatz pro Verkauf', value: `${format(profit)} 💵`, inline: true },
				{ name: 'Deine Credits', value: format(userBal) + ' 💵', inline: true },
				{ name: 'Lagerbestand', value: cd },
				{ name: 'Upgrades', value: `${up1} Personalupgrade\n${up2} Besserer Zulieferer\n${up3} ${company.nameUpgrade3}`, inline: true },
				{ name: 'Nächstes Unternehmen', value: `${nextBusiness?.name || 'Coming soon'}\nKosten: ${format(nextBusiness?.price)} Credits`, inline: true },
			)
            .setFooter('Azuma | Contact @florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
			.setColor('#2f3136');

		interaction.reply({ embeds: [embed], components: [row] })

        const message = await interaction.fetchReply()
        const filter = i => i.user.id == userId;

        const collector = message.createMessageComponentInteractionCollector(filter, { time: 300000 });

		collector.on('collect', async button => {
			getBusiness = await business.getBusiness(guildId, userId);
			company = await business.setCompany(guildId, userId);
			profit = await business.checkProfit(guildId, userId);
	
			up1 = getBusiness.upgrade1 ? yes : no;
			up2 = getBusiness.upgrade2 ? yes : no;
			up3 = getBusiness.upgrade3 ? yes : no;

			if (button.customID == 'sell') {
				const newBal = await economy.addCoins(guildId, userId, profit);
				await cooldowns.setCooldown(userId, 'work', 8 * 60 * 60);
				buttonSell.disabled = true;
				buttonSell.style = 2;
				
				const embed = new MessageEmbed()
					.setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.webp`)
					.setTitle(getBusiness.type)
					.setDescription('Das ist die Übersicht über dein Unternehmen. Von hier aus kannst du deine Ware verkaufen und neue Upgrades für dein Business kaufen.')
					.addFields(
						{ name: 'Umsatz pro Verkauf', value: `${format(profit)} 💵`, inline: true },
						{ name: 'Deine Credits', value: format(newBal) + ' 💵', inline: true },
						{ name: 'Lagerbestand', value: '░░░░░░░░░░░░░░░░░░\nVerkauf erfolgreich! `+' + format(profit) + ' Credits`' },
						{ name: 'Upgrades', value: `${up1} Personalupgrade\n${up2} Besserer Zulieferer\n${up3} ${company.nameUpgrade3}`, inline: true },
						{ name: 'Nächstes Unternehmen', value: `${nextBusiness?.name || 'Coming soon'}\nKosten: ${format(nextBusiness?.price)} Credits`, inline: true },
					)
					.setFooter('Azuma | Contact @florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
					.setColor('#2f3136');
				button.update({ embeds: [embed], components: [row] });
			}
			else if (button.customID == 'buyUpgrade1') {
				await buyUpgrade1(guildId, userId, getBusiness.type);
				const newBal = await addCoins(guildId, userId, company.priceUpgrade1 * -1);
				buttonUpgrade1.style = 2;
				buttonUpgrade1.disabled = true;
				const embed = new MessageEmbed()
					.setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.webp`)
					.setTitle(getBusiness.type)
					.setDescription('Das ist die Übersicht über dein Unternehmen. Von hier aus kannst du deine Ware verkaufen und neue Upgrades für dein Business kaufen.')
					.addFields(
						{ name: 'Umsatz pro Verkauf', value: `${format(profit)} 💵`, inline: true },
						{ name: 'Deine Credits', value: format(newBal) + ' 💵', inline: true },
						{ name: 'Lagerbestand', value: cd },
						{ name: 'Upgrades', value: `${yes} Personalupgrade\n${up2} Besserer Zulieferer\n${up3} ${company.nameUpgrade3}`, inline: true },
						{ name: 'Nächstes Unternehmen', value: `${nextBusiness?.name || 'Coming soon'}\nKosten: ${format(nextBusiness?.price)} Credits`, inline: true },
					)
					.setFooter('Azuma | Contact @florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
					.setColor('#2f3136');
				if (nextBusiness.priceUpgrade2 > newBal) {
					buttonUpgrade2.style = 2;
					buttonUpgrade2.disabled = true;
				};
				if (nextBusiness.priceUpgrade3 > newBal) {
					buttonUpgrade3.style = 2;
					buttonUpgrade3.disabled = true;
				};
				if (getBusiness.upgrade2 & getBusiness.upgrade3) {
					if (getBusiness.type !== cocaine.name && nextBusiness.price < newBal) {
						buttonNewBusiness.style = 1;
						buttonNewBusiness.disabled = false;
					} else {
						buttonNewBusiness.style = 2;
						buttonNewBusiness.disabled = true;
					};
					row.components = [ buttonSell, buttonNewBusiness ];
				};
				button.update({ embeds: [embed], components: [row] });
			}
			else if (button.customID == 'buyUpgrade2') {
				await buyUpgrade2(guildId, userId, getBusiness.type);
				const newBal = await addCoins(guildId, userId, company.priceUpgrade2 * -1);
				buttonUpgrade2.style = 2;
				buttonUpgrade2.disabled = true;
				const embed = new MessageEmbed()
					.setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.webp`)
					.setTitle(getBusiness.type)
					.setDescription('Das ist die Übersicht über dein Unternehmen. Von hier aus kannst du deine Ware verkaufen und neue Upgrades für dein Business kaufen.')
					.addFields(
						{ name: 'Umsatz pro Verkauf', value: `${format(profit)} 💵`, inline: true },
						{ name: 'Deine Credits', value: format(newBal) + ' 💵', inline: true },
						{ name: 'Lagerbestand', value: cd },
						{ name: 'Upgrades', value: `${up1} Personalupgrade\n${yes} Besserer Zulieferer\n${up3} ${company.nameUpgrade3}`, inline: true },
						{ name: 'Nächstes Unternehmen', value: `${nextBusiness?.name || 'Coming soon'}\nKosten: ${format(nextBusiness?.price)} Credits`, inline: true },
					)
					.setFooter('Azuma | Contact @florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
					.setColor('#2f3136');
				if (nextBusiness.priceUpgrade1 > newBal) {
					buttonUpgrade1.style = 2;
					buttonUpgrade1.disabled = true;
				};
				if (nextBusiness.priceUpgrade3 > newBal) {
					buttonUpgrade3.style = 2;
					buttonUpgrade3.disabled = true;
				};
				if (getBusiness.upgrade1 & getBusiness.upgrade3) {
					if (getBusiness.type !== cocaine.name && nextBusiness.price < newBal) {
						buttonNewBusiness.style = 1;
						buttonNewBusiness.disabled = false;
					} else {
						buttonNewBusiness.style = 2;
						buttonNewBusiness.disabled = true;
					};
					row.components = [ buttonSell, buttonNewBusiness ];
				};
				button.update({ embeds: [embed], components: [row] });
			}
			else if (button.customID == 'buyUpgrade3') {
				await buyUpgrade3(guildId, userId, getBusiness.type);
				const newBal = await addCoins(guildId, userId, company.priceUpgrade3 * -1);
				buttonUpgrade3.style = 2;
				buttonUpgrade3.disabled = true;
				const embed = new MessageEmbed()
					.setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.webp`)
					.setTitle(getBusiness.type)
					.setDescription('Das ist die Übersicht über dein Unternehmen. Von hier aus kannst du deine Ware verkaufen und neue Upgrades für dein Business kaufen.')
					.addFields(
						{ name: 'Umsatz pro Verkauf', value: `${format(profit)} 💵`, inline: true },
						{ name: 'Deine Credits', value: format(newBal) + ' 💵', inline: true },
						{ name: 'Lagerbestand', value: cd },
						{ name: 'Upgrades', value: `${up1} Personalupgrade\n${up2} Besserer Zulieferer\n${yes} ${company.nameUpgrade3}`, inline: true },
						{ name: 'Nächstes Unternehmen', value: `${nextBusiness?.name || 'Coming soon'}\nKosten: ${format(nextBusiness?.price)} Credits`, inline: true },
					)
					.setFooter('Azuma | Contact @florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
					.setColor('#2f3136');
				if (nextBusiness.priceUpgrade1 > newBal) {
					buttonUpgrade1.style = 2;
					buttonUpgrade1.disabled = true;
				};
				if (nextBusiness.priceUpgrade2 > newBal) {
					buttonUpgrade2.style = 2;
					buttonUpgrade2.disabled = true;
				};
				if (getBusiness.upgrade1 & getBusiness.upgrade2) {
					if (getBusiness.type !== cocaine.name && nextBusiness.price < newBal) {
						buttonNewBusiness.style = 1;
						buttonNewBusiness.disabled = false;
					} else {
						buttonNewBusiness.style = 2;
						buttonNewBusiness.disabled = true;
					};
					row.components = [ buttonSell, buttonNewBusiness ];
				};
				button.update({ embeds: [embed], components: [row] });
			}
			else if (button.customID == 'buyNext') {
				const newBusiness = nextBusiness;
				await buyBusiness(guildId, userId, nextBusiness.name);
				const newBal = await addCoins(guildId, userId, nextBusiness.price * -1);
				const newProfit = await business.checkProfit(guildId, userId);
				if (nextBusiness.name == documents.name) {
					nextBusiness = weed;
				}
				else if (nextBusiness.name == weed.name) {
					nextBusiness = fakeMoney;
				}
				else if (nextBusiness.name == fakeMoney.name) {
					nextBusiness = meth;
				}
				else if (nextBusiness.name == meth.name) {
					nextBusiness = cocaine;
				};
				const getCool = await cooldowns.getCooldown(userId, 'work');
				if (!getCool) {
					await cooldowns.setCooldown(userId, 'work', 8 * 60 * 60);	
				};
				const embed = new MessageEmbed()
					.setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.webp`)
					.setTitle(newBusiness.name)
					.setDescription('Das ist die Übersicht über dein Unternehmen. Von hier aus kannst du deine Ware verkaufen und neue Upgrades für dein Business kaufen.')
					.addFields(
						{ name: 'Umsatz pro Verkauf', value: `${format(newProfit)} 💵`, inline: true },
						{ name: 'Deine Credits', value: format(newBal) + ' 💵', inline: true },
						{ name: 'Lagerbestand', value: cd },
						{ name: 'Upgrades', value: `${no} Personalupgrade\n${no} Besserer Zulieferer\n${no} ${newBusiness.nameUpgrade3}`, inline: true },
						{ name: 'Nächstes Unternehmen', value: `${nextBusiness?.name || 'Coming soon'}\nKosten: ${format(nextBusiness?.price)} Credits`, inline: true },
					)
					.setFooter('Azuma | Contact @florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
					.setColor('#2f3136');
				if (nextBusiness.priceUpgrade1 < newBal) {
					buttonUpgrade1.style = 1;
					buttonUpgrade1.disabled = false;
				};
				if (nextBusiness.priceUpgrade2 < newBal) {
					buttonUpgrade2.style = 1;
					buttonUpgrade2.disabled = false;
				};
				if (nextBusiness.priceUpgrade3 < newBal) {
					buttonUpgrade3.style = 1;
					buttonUpgrade3.disabled = false;
				};
				row.components = [ buttonSell, buttonUpgrade1, buttonUpgrade2, buttonUpgrade3 ];
				button.update({ embeds: [embed], components: [row] });
			};
		
		});
	},
};