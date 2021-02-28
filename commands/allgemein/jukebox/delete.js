const Discord = require('discord.js');
const customs = require('../../../models/customs');

module.exports = {
	minArgs: 1,
	maxArgs: 1,
	expectedArgs: '<1-5>',
	callback: async ({ message, args, instance }) => {
		const prefix = instance.getPrefix(message.guild);
		const { author, channel } = message;
		const userId = author.id;
		const data = await customs.findOne({ userId });
		if (data.userId != userId) return;
		if (!data) return;
		if (data.textChannelId != channel.id) return;
		const msg = await channel.messages.fetch(data.jukeboxId);

		const args1 = undefined;
		const args2 = undefined;
		const args3 = undefined;
		const args4 = undefined;
		const args5 = undefined;

		if (args[0] === '1') {
			await customs.findOneAndUpdate(
				{
					userId,
				},
				{
					userId,
					args1,
				},
			);
			const data1 = await customs.findOne({ userId });
			const field1 = '/';
			let field2 = data1.args2;
			if (!field2) field2 = '/';
			let field3 = data1.args3;
			if (!field3) field3 = '/';
			let field4 = data1.args4;
			if (!field4) field4 = '/';
			let field5 = data1.args5;
			if (!field5) field5 = '/';

			const embed = new Discord.MessageEmbed()
				.setTitle('[BETA] Jukebox')
				.setDescription('Du kannst dir deine Lieblingssong abspeichern\nund diese dann per Shortcut abspielen!')
				.addFields(
					{ name: 'Speichere Songs:', value: `\`${prefix}save <number> <song>\``, inline: true },
					{ name: 'Lösche Songs:', value: `\`${prefix}delete <number>\``, inline: true },
					{ name: 'Deine gespeichterten Songs:', value: `:one: ${field1}\n:two: ${field2}\n:three: ${field3}\n:four: ${field4}\n:five: ${field5}` },
				)
				.setFooter('Du kannst maximal fünf Songs abspeichern!')
				.setColor('#f77600');
			msg.edit(embed);
			channel.send('Du hast den ersten Slot zurückgesetzt!');
		}
		else if (args[0] === '2') {
			await customs.findOneAndUpdate(
				{
					userId,
				},
				{
					userId,
					args2,
				},
			);
			const data1 = await customs.findOne({ userId });
			let field1 = data1.args1;
			if (!field1) field1 = '/';
			const field2 = '/';
			let field3 = data1.args3;
			if (!field3) field3 = '/';
			let field4 = data1.args4;
			if (!field4) field4 = '/';
			let field5 = data1.args5;
			if (!field5) field5 = '/';

			const embed = new Discord.MessageEmbed()
				.setTitle('[BETA] Jukebox')
				.setDescription('Du kannst dir deine Lieblingssong abspeichern\nund diese dann per Shortcut abspielen!')
				.addFields(
					{ name: 'Speichere Songs:', value: `\`${prefix}save <number> <song>\``, inline: true },
					{ name: 'Lösche Songs:', value: `\`${prefix}delete <number>\``, inline: true },
					{ name: 'Deine gespeichterten Songs:', value: `:one: ${field1}\n:two: ${field2}\n:three: ${field3}\n:four: ${field4}\n:five: ${field5}` },
				)
				.setFooter('Du kannst maximal fünf Songs abspeichern!')
				.setColor('#f77600');
			msg.edit(embed);
			channel.send('Du hast den zweiten Slot zurückgesetzt!');
		}
		else if (args[0] === '3') {
			await customs.findOneAndUpdate(
				{
					userId,
				},
				{
					userId,
					args3,
				},
			);
			const data1 = await customs.findOne({ userId });
			let field1 = data1.args1;
			if (!field1) field1 = '/';
			let field2 = data1.args2;
			if (!field2) field2 = '/';
			const field3 = '/';
			let field4 = data1.args4;
			if (!field4) field4 = '/';
			let field5 = data1.args5;
			if (!field5) field5 = '/';

			const embed = new Discord.MessageEmbed()
				.setTitle('[BETA] Jukebox')
				.setDescription('Du kannst dir deine Lieblingssong abspeichern\nund diese dann per Shortcut abspielen!')
				.addFields(
					{ name: 'Speichere Songs:', value: `\`${prefix}save <number> <song>\``, inline: true },
					{ name: 'Lösche Songs:', value: `\`${prefix}delete <number>\``, inline: true },
					{ name: 'Deine gespeichterten Songs:', value: `:one: ${field1}\n:two: ${field2}\n:three: ${field3}\n:four: ${field4}\n:five: ${field5}` },
				)
				.setFooter('Du kannst maximal fünf Songs abspeichern!')
				.setColor('#f77600');
			msg.edit(embed);
			channel.send('Du hast den dritten Slot zurückgesetzt!');
		}
		else if (args[0] === '4') {
			await customs.findOneAndUpdate(
				{
					userId,
				},
				{
					userId,
					args4,
				},
			);
			const data1 = await customs.findOne({ userId });
			let field1 = data1.args1;
			if (!field1) field1 = '/';
			let field2 = data1.args2;
			if (!field2) field2 = '/';
			let field3 = data1.args3;
			if (!field3) field3 = '/';
			const field4 = '/';
			let field5 = data1.args5;
			if (!field5) field5 = '/';

			const embed = new Discord.MessageEmbed()
				.setTitle('[BETA] Jukebox')
				.setDescription('Du kannst dir deine Lieblingssong abspeichern\nund diese dann per Shortcut abspielen!')
				.addFields(
					{ name: 'Speichere Songs:', value: `\`${prefix}save <number> <song>\``, inline: true },
					{ name: 'Lösche Songs:', value: `\`${prefix}delete <number>\``, inline: true },
					{ name: 'Deine gespeichterten Songs:', value: `:one: ${field1}\n:two: ${field2}\n:three: ${field3}\n:four: ${field4}\n:five: ${field5}` },
				)
				.setFooter('Du kannst maximal fünf Songs abspeichern!')
				.setColor('#f77600');
			msg.edit(embed);
			channel.send('Du hast den vierten Slot zurückgesetzt!');
		}
		else if (args[0] === '5') {
			await customs.findOneAndUpdate(
				{
					userId,
				},
				{
					userId,
					args5,
				},
			);
			const data1 = await customs.findOne({ userId });
			let field1 = data1.args1;
			if (!field1) field1 = '/';
			let field2 = data1.args2;
			if (!field2) field2 = '/';
			let field3 = data1.args3;
			if (!field3) field3 = '/';
			let field4 = data1.args4;
			if (!field4) field4 = '/';
			const field5 = '/';

			const embed = new Discord.MessageEmbed()
				.setTitle('[BETA] Jukebox')
				.setDescription('Du kannst dir deine Lieblingssong abspeichern\nund diese dann per Shortcut abspielen!')
				.addFields(
					{ name: 'Speichere Songs:', value: `\`${prefix}save <number> <song>\``, inline: true },
					{ name: 'Lösche Songs:', value: `\`${prefix}delete <number>\``, inline: true },
					{ name: 'Deine gespeichterten Songs:', value: `:one: ${field1}\n:two: ${field2}\n:three: ${field3}\n:four: ${field4}\n:five: ${field5}` },
				)
				.setFooter('Du kannst maximal fünf Songs abspeichern!')
				.setColor('#f77600');
			msg.edit(embed);
			channel.send('Du hast den fünften Slot zurückgesetzt!');
		}
	},
};