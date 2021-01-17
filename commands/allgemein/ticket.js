const { MessageEmbed } = require('discord.js');
const cooldowns = new Set();

module.exports = {
	maxArgs: 1,
	expectedArgs: 'close',
	callback: async ({ message, args }) => {
		if (message.channel.id !== '365763570371133451') return;
		if (!args.length) {
			if (cooldowns.has(message.author.id)) return message.channel.send('Bitte spamme diesen Befehl nicht.');
			cooldowns.add(message.author.id);
			setTimeout(() => cooldowns.delete(message.author.id), 60000);

			const { guild, member, author } = message;
			const memberId = member.id;

			message.reply('du hast ein Ticket erstellt und wurdest in deinem Raum erwähnt.');

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
			message.reply('dieses Feature befindet sich aktuell noch in der Entwicklung. Bitte frage einen Mod ob er das Ticket für dich schließen kann.');
		}
	},
};