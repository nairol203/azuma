const customs = require('../../models/customs');

module.exports = {
	minArgs: 2,
	expectedArgs: '<1-5> <song>',
	callback: async ({ message, args, Discord }) => {
		const prefix = process.env.PREFIX;
		const { author, channel } = message;
		const song = args.join(' ');
		const userId = author.id;
		const data = await customs.findOne({ userId });
		if (data.userId != userId) return;
		if (!data) return;
		if (data.textChannelId != channel.id) return;
		const msg = await channel.messages.fetch(data.jukeboxId);

		if (args[0] === '1') {
			message.delete();
			const args1 = song.toString().replace('1 ', '');
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
			let field1 = data1.args1;
			if (!field1) field1 = '/';
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
			channel.send(`Du hast ${args1} auf der 1 gespeichert!`).then(msg => {msg.delete({ timeout: 5000 }); });
		}
		else if (args[0] === '2') {
			message.delete();
			const args2 = song.toString().replace('2 ', '');
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
			channel.send(`Du hast ${args2} auf der 2 gespeichert!`).then(msg => {msg.delete({ timeout: 5000 }); });
		}
		else if (args[0] === '3') {
			message.delete();
			const args3 = song.toString().replace('3 ', '');
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
			channel.send(`Du hast ${args3} auf der 3 gespeichert!`).then(msg => {msg.delete({ timeout: 5000 }); });
		}
		else if (args[0] === '4') {
			message.delete();
			const args4 = song.toString().replace('4 ', '');
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
			channel.send(`Du hast ${args4} auf der 4 gespeichert!`).then(msg => {msg.delete({ timeout: 5000 }); });
		}
		else if (args[0] === '5') {
			message.delete();
			const args5 = song.toString().replace('5 ', '');
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
			channel.send(`Du hast ${args5} auf der 5 gespeichert!`).then(msg => {msg.delete({ timeout: 5000 }); });
		}

	},
};