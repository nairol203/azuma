const { MessageEmbed } = require('discord.js');
const fish_stats = require('../../features/fish_stats');

module.exports = {
	slash: true,
	description: 'Überträgt deine Tatsu Fishstats auf Azuma',
	options: [
		{
			name: 'User',
			description: 'Wähle ein beliebiges Servermitglied aus',
			type: 6,
			required: true,
		},
		{
			name: 'Commons',
			description: 'Setze die Menge der Gewöhnlichen Fische fest',
			type: '4',
			required: true,
		},
		{
			name: 'Uncommons',
			description: 'Setze die Menge der Ungewöhnlichen Fische fest',
			type: '4',
			required: true,
		},
		{
			name: 'Rares',
			description: 'Setze die Menge der seltenen Fische fest',
			type: '4',
			required: true,
		},
		{
			name: 'Garbage',
			description: 'Setze die Menge des Mülls fest',
			type: '4',
			required: true,
		},
	],
	requiredPermissions: ['ADMINISTRATOR'],
	callback: async ({ client, args }) => {
		const { user, commons, uncommons, rares, garbage } = args;

		const member = client.users.cache.get(user);
		if (member.bot) return 'Du kannst keinem Bot Stats übertragen.';

		const newCommon = await fish_stats.setCommon(user, commons);
		const newUncommon = await fish_stats.setUncommon(user, uncommons);
		const newRare = await fish_stats.setRare(user, rares);
		const newGarbage = await fish_stats.setGarbage(user, garbage);

		const embed = new MessageEmbed()
			.setColor('#00b8ff')
			.addField(`Deploying stats from ${member.username}`, `Stats werden von Tatsu auf Azuma übertragen...\n**Neue Stats:** ${newCommon} 🐟, ${newUncommon} 🐠, ${newRare} 🦑, ${newGarbage} 🗑️`);
		return embed;
	},
};