const { MessageEmbed } = require('discord.js');
const economy = require('../../features/economy');

module.exports = {
	slash: true,
	ownerOnly: true,
	requiredPermissions: ['ADMINISTRATOR'],
	callback: async ({ client, args, prefix, interaction }) => {
		const userId = args.user;
		const credits = args.credits;
		const guild = client.guilds.cache.get(interaction.guild_id);

		const newBalance = await economy.addCoins(guild.id, userId, credits)

		const embed = new MessageEmbed()
			.setColor('#f77600')
			.addField(`💵  |  **${interaction.member.nick}**,`, `du hast <@${userId}> **${credits}** Credit(s) gegeben.\n<@${userId}> hat jetzt **${newBalance}** Credit(s)!`);
		return embed;

		// const guild = message.guild;
		// const prefix = process.env.PREFIX;

		// const mention = message.mentions.users.first();
		// if (mention.bot) return;

		// if (!mention) {
		// 	message.channel.send(`<:no:767394810909949983> | Ungültiger Befehl, versuche es so: \`${prefix}addcredits <user> <credits>\``);
		// 	return;
		// }

		// const coins = args[1];
		// if (isNaN(coins)) {
		// 	message.channel.send(`<:no:767394810909949983> | Ungültiger Befehl, versuche es so: \`${prefix}addcredits <user> <credits>\``);
		// 	return;
		// }

		// const userId = mention.id;

		// const newCoins = await economy.addCoins(guild.id, userId, coins);

		// const embed = new Discord.MessageEmbed()
		// 	.setColor('#f77600')
		// 	.addField(`💵  |  **${message.author.username}**,`, `du hast <@${userId}> **${coins}** Credit(s) gegeben.\n<@${userId}> hat jetzt **${newCoins}** Credit(s)!`);
		// message.channel.send(embed);
	},
};
