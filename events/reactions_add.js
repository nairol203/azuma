const { MessageEmbed, Collection } = require('discord.js');
const { no } = require('../emoji.json');
const channel = new Collection();

module.exports = {
	name: 'messageReactionAdd',
	async run(reaction, user) {
		const { message, _emoji } = reaction;
		if (reaction.message.partial) await reaction.message.fetch();
		if (reaction.partial) await reaction.fetch();
		if (user.bot) return;
		if (message.channel.id == '782595813196038175') {
			if (_emoji.name == '🔔') {
				await message.guild.members.cache.get(user.id).roles.add('796010383441133578');
			}
			if (_emoji.id == '782650903156621382') {
				await message.guild.members.cache.get(user.id).roles.add('794708386930753586');
			}
			if (_emoji.id == '822631021714473001') {
				await message.guild.members.cache.get(user.id).roles.add('816211689136848907');
			}
		}
		else if (message.channel.id == '365763570371133451') {
			if (_emoji.name == '✉️') {
				const newChannel = await message.guild.channels.create(`${user.username}'s ticket`, {
					parent: '770778171280719902',
					permissionOverwrites: [
						{
							id: '255741114273759232',
							deny: ['VIEW_CHANNEL'],
						},
						{
							id: user.id,
							allow: ['VIEW_CHANNEL'],
						},
					],
				});

				const embed = new MessageEmbed()
					.setTitle(`Willkommen in deinem Ticket-Kanal, ${user.username}!`)
					.setDescription('Hier kannst du den Mods dein Problem schildern. Sie werden dir schnellstmöglich antworten.\n\nDu kannst das Ticket schließen indem du auf ' + no + ' reagierst.')
					.setColor('f77600');
				newChannel.send(`${user} <@&799397095337230387>`);
				const msgEmbed = await newChannel.send(embed);
				channel.set(newChannel.name, newChannel);
				msgEmbed.react('<:no:76739480909949983>');
			}
		}
		const ticket = channel.get(user.username + 's-ticket');
		if (ticket) {
			if (message.channel.id == ticket.id) {
				if (user.id == '772508572647030796') {
					return;
				}
				if (_emoji.id == '767394810909949983') {
					ticket.delete();
				}
			}
		}
		else {
			return;
		}
	},
};