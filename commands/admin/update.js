const { MessageEmbed } = require('discord.js');
const { epic, rockstar } = require('../../emoji.json');

module.exports = {
	slash: true,
	description: 'Update für  bestimmte Embeds',
	options: [
		{
			name: 'Channel',
			description: 'Setze einen Channel fest',
			required: true,
			type: 3,
			choices: [
				{
					name: 'rollenverteilung',
					value: 'rollenverteilung',
				},
				{
					name: 'modmail',
					value: 'modmail',
				}
			]
		}
	],
	ownerOnly: true,
	callback: async ({ args, client }) => {
		if (args.channel === 'rollenverteilung') {
			const channel = await client.channels.fetch('782595813196038175');
			channel.messages.fetch().then(async (messages) => {
				const embed = new MessageEmbed()
					.setTitle(':clipboard: Rollenverteilung')
					.setDescription(`
\`\`\`Füge eine Reaktion hinzu oder entferne eine, je nach dem welche Rolle du haben willst (●\'◡\'●)\`\`\`
:bell: **Server-News** - Bekomme immer eine Benachrichtigung wenn ein Update von diesem Server gepostet wird!

${epic} **Epic Games** - Bekomme immer eine Benachrichtigung wenn ein Spiel im Epic Store gratis ist!

${rockstar} **Newswire** - Bekomme immer eine Benachrichtigung wenn ein neuer Newswire zu GTA5 gepostet wurde!
					`)
					.setColor('#f77600')
					.setFooter('Letztes Update')
					.setTimestamp('2021-02-16T13:31:00.000Z');
				if (messages.size === 0) {
					channel.send(embed).then(async (msg) => {
						await msg.react('🔔');
						await msg.react(epic);
						await msg.react(rockstar);
					});
				}
				else {
					for (const message of messages) {
						message[1].edit(embed);
						await message[1].react('🔔');
						await message[1].react(epic);
						await message[1].react(rockstar);
					}
				}
			});
		}
		else if (args.channel === 'modmail') {
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
		return '#' + args.channel + ' wurde aktualisiert!';
	},
};