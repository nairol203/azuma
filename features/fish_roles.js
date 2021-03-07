const fishing = require('./fish_stats');

module.exports = (client) => {
	client.on('message', async message => {
		if(message.author.bot) return;
		if(!message.guild) return;
		const userId = message.author.id;
		const uncommon = await fishing.getUncommon(userId); const rare = await fishing.getRare(userId);

		const anfänger = message.guild.roles.cache.find(role => role.name === 'Angel-Anfänger');
		if (anfänger === undefined) return;
		if (rare < 1 & uncommon >= 25 & uncommon < 125) {
			message.guild.members.cache.get(message.author.id).roles.add(anfänger);
		}
		else {
			message.guild.members.cache.get(message.author.id).roles.remove(anfänger);
		}
		const bronze = message.guild.roles.cache.find(role => role.name === 'Bronze-Angler');
		if (bronze === undefined) return;
		if (rare >= 5 & rare < 10) {
			message.guild.members.cache.get(message.author.id).roles.add(bronze);
		}
		else {
			message.guild.members.cache.get(message.author.id).roles.remove(bronze);
		}
		const silber = message.guild.roles.cache.find(role => role.name === 'Silber-Angler');
		if (silber === undefined) return;
		if (rare >= 10 & rare < 15) {
			message.guild.members.cache.get(message.author.id).roles.add(silber);
		}
		else {
			message.guild.members.cache.get(message.author.id).roles.remove(silber);
		}
		const gold = message.guild.roles.cache.find(role => role.name === 'Gold-Angler');
		if (gold === undefined) return;
		if (rare >= 15 & rare < 20) {
			message.guild.members.cache.get(message.author.id).roles.add(gold);
		}
		else {
			message.guild.members.cache.get(message.author.id).roles.remove(gold);
		}
		const platin = message.guild.roles.cache.find(role => role.name === 'Platin-Angler');
		if (platin === undefined) return;
		if (rare >= 20 & rare < 30) {
			message.guild.members.cache.get(message.author.id).roles.add(platin);
		}
		else {
			message.guild.members.cache.get(message.author.id).roles.remove(platin);
		}
		const elite = message.guild.roles.cache.find(role => role.name === 'Elite-Fischer');
		if (elite === undefined) return;
		if (rare >= 30 & rare < 40) {
			message.guild.members.cache.get(message.author.id).roles.add(elite);
		}
		else {
			message.guild.members.cache.get(message.author.id).roles.remove(elite);
		}
		const meister = message.guild.roles.cache.find(role => role.name === 'Angelmeister');
		if (meister === undefined) return;
		if (rare >= 40 & rare < 50) {
			message.guild.members.cache.get(message.author.id).roles.add(meister);
		}
		else {
			message.guild.members.cache.get(message.author.id).roles.remove(meister);
		}
		const wahrerMeister = message.guild.roles.cache.find(role => role.name === 'Wahrer Angelmeister');
		if (wahrerMeister === undefined) return;
		if (rare >= 50) {
			message.guild.members.cache.get(message.author.id).roles.add(wahrerMeister);
		}
		else {
			message.guild.members.cache.get(message.author.id).roles.remove(wahrerMeister);
		}
	});
};