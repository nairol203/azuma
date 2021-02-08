const { MessageEmbed } = require('discord.js');
const cooldowns = new Set();

module.exports = {
	maxArgs: 1,
	expectedArgs: 'close',
	callback: async ({ message, args }) => {
		if (!args.length) {
			if(!message.channel === '365763570371133451') return;
			if (cooldowns.has(message.author.id)) return message.channel.send('Bitte spamme diesen Befehl nicht.');
			cooldowns.add(message.author.id);
			setTimeout(() => cooldowns.delete(message.author.id), 60000);

			const { guild, member, author } = message;
			const memberId = member.id;

			message.reply('du hast ein Ticket erstellt und wurdest in deinem privaten Raum erwähnt.');

			const role = guild.roles.cache.find((test) => {
				return test.name === '@everyone';
			});

			const newChannel = await guild.channels.create(`${author.username}'s ticket`, {
				parent: '770778171280719902',
				permissionOverwrites: [
					{
						id: role.id,
						deny: ['VIEW_CHANNEL'],
					},
					{
						id: memberId,
						allow: ['VIEW_CHANNEL'],
					},
				],
			});

			const embed = new MessageEmbed()
				.setTitle(`Willkommen in deinem Ticket-Kanal, ${author.username}!`)
				.setDescription('Hier kannst du den Mods dein Problem schildern. Sie werden dir schnellstmöglich antworten.')
				.setColor('f77600')
				.setFooter('Tipp: Mit !ticket close kannst du dein Ticket schließen.');
			newChannel.send(`${author} <@&799397095337230387>`);
			newChannel.send(embed);
		}
		else if (args[0] === 'close') {
			message.channel.setParent('692533397796421662');
			message.channel.updateOverwrite(message.author, { VIEW_CHANNEL: true });
			message.reply('du hast diesen Kanal ins Archiv verschoben. Wenn du ihn endgültig löschen willst, muss ein Administrator das für dich tun.');
		}
	},
};