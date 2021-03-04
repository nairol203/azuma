const Discord = require('discord.js');

module.exports = {
	ownerOnly: true,
	callback: async ({ args, client }) => {
		if (args[0] == '<#782595813196038175>') {
			const channel = await client.channels.fetch('782595813196038175');
			channel.messages.fetch().then(async (messages) => {
				const embed = new Discord.MessageEmbed()
					.setTitle(':clipboard: Rollenverteilung')
					.setDescription('```Füge eine Reaktion hinzu oder entferne eine, je nach dem welche Rolle du haben willst (●\'◡\'●)```\n<:EpicGames:782650903156621382> **Free Epic Games** - Bekomme immer eine Benachrichtigung wenn ein Spiel im Epic Store gratis ist!\n\n:bell: **Server-News** - Bekomme immer eine Benachrichtigung wenn ein Update von diesem Server gepostet wird!')
					.setColor('#f77600')
					.setFooter('Letztes Update')
					.setTimestamp('2021-02-16T13:31:00.000Z');
				if (messages.size === 0) {
					channel.send(embed).then(async (msg) => {
						await msg.react('<:EpicGames:782650903156621382>');
						await msg.react('🔔');
					});
				}
				else {
					for (const message of messages) {
						message[1].edit(embed);
						await message[1].react('<:EpicGames:782650903156621382>');
						await message[1].react('🔔');
					}
				}
			});
		}
		else if (args[0] == '<#365763570371133451>') {
			const channel = await client.channels.fetch('365763570371133451');
			channel.messages.fetch().then(async (messages) => {
				const embed = new Discord.MessageEmbed()
					.setTitle(':envelope: Support Ticket')
					.setDescription('Du hast eine Frage oder ein Problem über den Server die nicht in <#786936121774702603> geklärt wurde?\nUm ein Ticket zu erstellen reagiere mit :envelope: !')
					.setColor('#f77600')
					.setImage('https://media.discordapp.net/attachments/792499474609602561/811178842369949706/Hnet.com-image_1.gif')
					.setFooter('Letztes Update')
					.setTimestamp('2021-02-16T13:31:00.000Z');
				if (messages.size === 0) {
					channel.send(embed).then(async (msg) => {
						await msg.react('✉️');
					});
				}
				else {
					for (const message of messages) {
						message[1].edit(embed);
						await message[1].react('✉️');
					}
				}
			});
		}
	},
};