const { MessageEmbed } = require('discord.js');
const { yes, no } = require('../../emoji.json');

const business = require('../../features/business');
const cooldowns = require('../../cooldowns');

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
	slash: true,
	description: 'Verwalte dein eigenes Unternehmen und werde ein angesehener CEO!',
	callback: async ({ interaction }) => {
		const guildId = interaction.guild_id
		const member = interaction.member;
		const userId = member.user.id

		const getBusiness = await business.getBusiness(guildId, userId);

		if (getBusiness === null) return no + ' | Du hast kein Unternehmen, kaufe eins mit `!buy [business]`!';

		const company = await business.setCompany(guildId, userId);
		const profit = await business.checkProfit(guildId, userId);

		const up1 = getBusiness.upgrade1 ? yes : no;
		const up2 = getBusiness.upgrade2 ? yes : no;
		const up3 = getBusiness.upgrade3 ? yes : no;

		const getCooldown = await cooldowns.getCooldown(userId, 'work');

		let cd = '';
		let cooldown = '';
		if (getCooldown === null) {
			cd = '██████████████████\nDein Lager ist voll! Verkaufe die Ware mit `!work`';
		}
		else {
			cooldown = getCooldown;
			cd = showBar(cooldown);
		}
		const embed = new MessageEmbed()
			.setTitle(`${member.user.username}'s ${getBusiness.type}`)
			.addFields(
				{ name: 'Akuteller Umsatz', value: `\`${format(profit)}\` 💵` },
				{ name: 'Lagerbestand', value: cd },
				{ name: 'Upgrades:', value: `${up1} Personalupgrade\n${up2} Besserer Zulieferer\n${up3} ${company.nameUpgrade3}` },
			)
			.setColor('#2f3136');
		return embed;
	},
};