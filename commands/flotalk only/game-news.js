module.exports = {
	callback: ({ message }) => {
		const Discord = require('discord.js');
		const embed = new Discord.MessageEmbed()
			.setColor('#f77600')
			.setTitle('Game-News:')
			.setDescription('**Aktuell werden von diesen Games News in #game-news gepostet:**\n- Bloons Tower Defense (Tweets von @ninjakiwigames)\n- Borderlands (SHiFT Codes)\n- Destiny 2 (Weekly Reset & Xur Übersichten, Tweets von @BungieHelp)\n- Final Fantasy XIV (Lodestone Updates und Fashion Report)\n- Minecraft (Neue Updates für Java- & Bedrock Edtion\n- Raft (Neue Updates)');
		return message.channel.send(embed);
	},
};