const { MessageEmbed } = require("discord.js");
const { epic, rockstar, ffxiv, destiny2 } = require('../../emoji.json');

module.exports = {
	callback: async ({ args, client }) => {
		if (args[0] == '<#782595813196038175>') {
			const channel = await client.channels.fetch('782595813196038175');
			channel.messages.fetch().then(async (messages) => {
				const embed = new MessageEmbed()
					.setTitle(':clipboard: Rollenverteilung')
					.setDescription(`
\`\`\`Füge eine Reaktion hinzu oder entferne eine, je nach dem welche Rolle du haben willst (●'◡'●)\`\`\`
__**Newschannel**__

${ffxiv} **Final Fantasy XIV** - Lodestone News und Fashion Report

${destiny2} **Destiny 2** - Tweets von @BungieHelp und Weekly Information

🎮 **Andere Games** - News von anderen Games, z.B.: Minecraft, Borderlands, Raft, ...

__**Benachrichtigungen**__

${epic} **Free Epic Games** - Jeden Donnerstag ein neues Gratis Spiel im Epic Store!

${rockstar} **Rockstar Newswire** - Jeden Donnerstag ein neuer Newswire von GTA5!

🔔 **Price Alert** - Amazon Price Alert!
`)
					.setColor('#f77600')
					.setFooter('Letztes Update')
					.setTimestamp('2021-06-30T18:42:00.000Z');
				if (messages.size === 0) {
					channel.send({ embeds: [embed]}).then(async (msg) => {
						await msg.react(ffxiv);
						await msg.react(destiny2);
						await msg.react('🎮');
						await msg.react(epic);
						await msg.react(rockstar);
						await msg.react('🔔');
					});
				}
				else {
					for (const message of messages) {
						message[1].edit({ embeds: [embed]});
						await message[1].react(ffxiv);
						await message[1].react(destiny2);
						await message[1].react('🎮');
						await message[1].react(epic);
						await message[1].react(rockstar);
						await message[1].react('🔔');
					}
				}
			});
		}
		else if (args[0] == '<#365763570371133451>') {
			const channel = await client.channels.fetch('365763570371133451');
			channel.messages.fetch().then(async (messages) => {
				const embed = new MessageEmbed()
					.setTitle(':envelope: Support Ticket')
					.setDescription('Du hast eine Frage oder ein Problem über den Server die nicht in <#786936121774702603> geklärt wurde?\nUm ein Ticket zu erstellen reagiere mit :envelope: !')
					.setColor('#f77600')
					.setImage('https://media.discordapp.net/attachments/792499474609602561/811178842369949706/Hnet.com-image_1.gif')
					.setFooter('Letztes Update')
					.setTimestamp('2021-02-16T13:31:00.000Z');
				if (messages.size === 0) {
					channel.send({ embeds: [embed]}).then(async (msg) => {
						await msg.react('✉️');
					});
				}
				else {
					for (const message of messages) {
						message[1].edit({ embeds: [embed]});
						await message[1].react('✉️');
					}
				}
			});
		}
	},
};