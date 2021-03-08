const { MessageEmbed } = require('discord.js');
const customs = require('../../models/customs');

module.exports = {
	slash: true,
	callback: async ({ client, args, interaction }) => {
		const userId = interaction.member.user.id;
		const channelId = interaction.channel_id;
		const slot = args.slot;
		const data = await customs.findOne({ userId });
		if (!data) return 'Err0';
		if (data.userId =! userId) return 'Err1';
		if (data.textChannelId != channelId) return 'Err2';
		const channel = client.channels.cache.get(channelId)
		const msg = await channel.messages.fetch(data.jukeboxId);

		let field1 = data.args1;
		if (!field1) field1 = '/';
		let field2 = data.args2;
		if (!field2) field2 = '/';
		let field3 = data.args3;
		if (!field3) field3 = '/';
		let field4 = data.args4;
		if (!field4) field4 = '/';
		let field5 = data.args5;
		if (!field5) field5 = '/';

		const embed = new MessageEmbed()
			.setTitle('Jukebox')
			.setDescription('Du kannst dir deine Lieblingssong abspeichern\nund diese dann per Shortcut abspielen!')
			.addFields(
				{ name: 'Speichere Songs:', value: '`/save <number> <song>`', inline: true },
				{ name: 'Lösche Songs:', value: '`/delete <number>`', inline: true },
			)
			.setFooter('Du kannst maximal fünf Songs abspeichern!')
			.setColor('#f77600');

		if (slot == 1) {
			const args1 = undefined
			await customs.findOneAndUpdate(
				{
					userId,
				},
				{
					userId,
					args1,
				},
			);
			field1 = '/';
		}
		if (slot == 2) {
			const args2 = undefined
			await customs.findOneAndUpdate(
				{
					userId,
				},
				{
					userId,
					args2,
				},
			);
			field2 = '/';
		}
		if (slot == 3) {
			const args3 = undefined
			await customs.findOneAndUpdate(
				{
					userId,
				},
				{
					userId,
					args3,
				},
			);
			field3 = '/';
		}
		if (slot == 4) {
			const args4 = undefined
			await customs.findOneAndUpdate(
				{
					userId,
				},
				{
					userId,
					args4,
				},
			);
			field4 = '/';
		}
		if (slot == 5) {
			const args5 = undefined
			await customs.findOneAndUpdate(
				{
					userId,
				},
				{
					userId,
					args5,
				},
			);
			field5 = '/';
		}
		embed.addField('Deine gespeicherten Songs:', `:one: ${field1}\n:two: ${field2}\n:three: ${field3}\n:four: ${field4}\n:five: ${field5}`)
		msg.edit(embed)
		return `Du hast Slot ${slot} zurückgesetzt!`;

		// const prefix = process.env.PREFIX;
		// const { author, channel } = message;
		// const userId = author.id;
		// const data = await customs.findOne({ userId });
		// if (data.userId != userId) return;
		// if (!data) return;
		// if (data.textChannelId != channel.id) return;
		// const msg = await channel.messages.fetch(data.jukeboxId);

		// const args1 = undefined;
		// const args2 = undefined;
		// const args3 = undefined;
		// const args4 = undefined;
		// const args5 = undefined;

		// if (args[0] === '1') {
		// 	message.delete();
		// 	await customs.findOneAndUpdate(
		// 		{
		// 			userId,
		// 		},
		// 		{
		// 			userId,
		// 			args1,
		// 		},
		// 	);
		// 	const data1 = await customs.findOne({ userId });
		// 	const field1 = '/';
		// 	let field2 = data1.args2;
		// 	if (!field2) field2 = '/';
		// 	let field3 = data1.args3;
		// 	if (!field3) field3 = '/';
		// 	let field4 = data1.args4;
		// 	if (!field4) field4 = '/';
		// 	let field5 = data1.args5;
		// 	if (!field5) field5 = '/';

		// 	const embed = new Discord.MessageEmbed()
		// 		.setTitle('Jukebox')
		// 		.setDescription('Du kannst dir deine Lieblingssong abspeichern\nund diese dann per Shortcut abspielen!')
		// 		.addFields(
		// 			{ name: 'Speichere Songs:', value: `\`${prefix}save <number> <song>\``, inline: true },
		// 			{ name: 'Lösche Songs:', value: `\`${prefix}delete <number>\``, inline: true },
		// 			{ name: 'Deine gespeichterten Songs:', value: `:one: ${field1}\n:two: ${field2}\n:three: ${field3}\n:four: ${field4}\n:five: ${field5}` },
		// 		)
		// 		.setFooter('Du kannst maximal fünf Songs abspeichern!')
		// 		.setColor('#f77600');
		// 	msg.edit(embed);
		// 	channel.send('Du hast den ersten Slot zurückgesetzt!').then(msg => {msg.delete({ timeout: 5000 }); });
		// }
		// else if (args[0] === '2') {
		// 	message.delete();
		// 	await customs.findOneAndUpdate(
		// 		{
		// 			userId,
		// 		},
		// 		{
		// 			userId,
		// 			args2,
		// 		},
		// 	);
		// 	const data1 = await customs.findOne({ userId });
		// 	let field1 = data1.args1;
		// 	if (!field1) field1 = '/';
		// 	const field2 = '/';
		// 	let field3 = data1.args3;
		// 	if (!field3) field3 = '/';
		// 	let field4 = data1.args4;
		// 	if (!field4) field4 = '/';
		// 	let field5 = data1.args5;
		// 	if (!field5) field5 = '/';

		// 	const embed = new Discord.MessageEmbed()
		// 		.setTitle('Jukebox')
		// 		.setDescription('Du kannst dir deine Lieblingssong abspeichern\nund diese dann per Shortcut abspielen!')
		// 		.addFields(
		// 			{ name: 'Speichere Songs:', value: `\`${prefix}save <number> <song>\``, inline: true },
		// 			{ name: 'Lösche Songs:', value: `\`${prefix}delete <number>\``, inline: true },
		// 			{ name: 'Deine gespeichterten Songs:', value: `:one: ${field1}\n:two: ${field2}\n:three: ${field3}\n:four: ${field4}\n:five: ${field5}` },
		// 		)
		// 		.setFooter('Du kannst maximal fünf Songs abspeichern!')
		// 		.setColor('#f77600');
		// 	msg.edit(embed);
		// 	channel.send('Du hast den zweiten Slot zurückgesetzt!').then(msg => {msg.delete({ timeout: 5000 }); });
		// }
		// else if (args[0] === '3') {
		// 	message.delete();
		// 	await customs.findOneAndUpdate(
		// 		{
		// 			userId,
		// 		},
		// 		{
		// 			userId,
		// 			args3,
		// 		},
		// 	);
		// 	const data1 = await customs.findOne({ userId });
		// 	let field1 = data1.args1;
		// 	if (!field1) field1 = '/';
		// 	let field2 = data1.args2;
		// 	if (!field2) field2 = '/';
		// 	const field3 = '/';
		// 	let field4 = data1.args4;
		// 	if (!field4) field4 = '/';
		// 	let field5 = data1.args5;
		// 	if (!field5) field5 = '/';

		// 	const embed = new Discord.MessageEmbed()
		// 		.setTitle('Jukebox')
		// 		.setDescription('Du kannst dir deine Lieblingssong abspeichern\nund diese dann per Shortcut abspielen!')
		// 		.addFields(
		// 			{ name: 'Speichere Songs:', value: `\`${prefix}save <number> <song>\``, inline: true },
		// 			{ name: 'Lösche Songs:', value: `\`${prefix}delete <number>\``, inline: true },
		// 			{ name: 'Deine gespeichterten Songs:', value: `:one: ${field1}\n:two: ${field2}\n:three: ${field3}\n:four: ${field4}\n:five: ${field5}` },
		// 		)
		// 		.setFooter('Du kannst maximal fünf Songs abspeichern!')
		// 		.setColor('#f77600');
		// 	msg.edit(embed);
		// 	channel.send('Du hast den dritten Slot zurückgesetzt!').then(msg => {msg.delete({ timeout: 5000 }); });
		// }
		// else if (args[0] === '4') {
		// 	message.delete();
		// 	await customs.findOneAndUpdate(
		// 		{
		// 			userId,
		// 		},
		// 		{
		// 			userId,
		// 			args4,
		// 		},
		// 	);
		// 	const data1 = await customs.findOne({ userId });
		// 	let field1 = data1.args1;
		// 	if (!field1) field1 = '/';
		// 	let field2 = data1.args2;
		// 	if (!field2) field2 = '/';
		// 	let field3 = data1.args3;
		// 	if (!field3) field3 = '/';
		// 	const field4 = '/';
		// 	let field5 = data1.args5;
		// 	if (!field5) field5 = '/';

		// 	const embed = new Discord.MessageEmbed()
		// 		.setTitle('Jukebox')
		// 		.setDescription('Du kannst dir deine Lieblingssong abspeichern\nund diese dann per Shortcut abspielen!')
		// 		.addFields(
		// 			{ name: 'Speichere Songs:', value: `\`${prefix}save <number> <song>\``, inline: true },
		// 			{ name: 'Lösche Songs:', value: `\`${prefix}delete <number>\``, inline: true },
		// 			{ name: 'Deine gespeichterten Songs:', value: `:one: ${field1}\n:two: ${field2}\n:three: ${field3}\n:four: ${field4}\n:five: ${field5}` },
		// 		)
		// 		.setFooter('Du kannst maximal fünf Songs abspeichern!')
		// 		.setColor('#f77600');
		// 	msg.edit(embed);
		// 	channel.send('Du hast den vierten Slot zurückgesetzt!').then(msg => {msg.delete({ timeout: 5000 }); });
		// }
		// else if (args[0] === '5') {
		// 	message.delete();
		// 	await customs.findOneAndUpdate(
		// 		{
		// 			userId,
		// 		},
		// 		{
		// 			userId,
		// 			args5,
		// 		},
		// 	);
		// 	const data1 = await customs.findOne({ userId });
		// 	let field1 = data1.args1;
		// 	if (!field1) field1 = '/';
		// 	let field2 = data1.args2;
		// 	if (!field2) field2 = '/';
		// 	let field3 = data1.args3;
		// 	if (!field3) field3 = '/';
		// 	let field4 = data1.args4;
		// 	if (!field4) field4 = '/';
		// 	const field5 = '/';

		// 	const embed = new Discord.MessageEmbed()
		// 		.setTitle('Jukebox')
		// 		.setDescription('Du kannst dir deine Lieblingssong abspeichern\nund diese dann per Shortcut abspielen!')
		// 		.addFields(
		// 			{ name: 'Speichere Songs:', value: `\`${prefix}save <number> <song>\``, inline: true },
		// 			{ name: 'Lösche Songs:', value: `\`${prefix}delete <number>\``, inline: true },
		// 			{ name: 'Deine gespeichterten Songs:', value: `:one: ${field1}\n:two: ${field2}\n:three: ${field3}\n:four: ${field4}\n:five: ${field5}` },
		// 		)
		// 		.setFooter('Du kannst maximal fünf Songs abspeichern!')
		// 		.setColor('#f77600');
		// 	msg.edit(embed);
		// 	channel.send('Du hast den fünften Slot zurückgesetzt!').then(msg => {msg.delete({ timeout: 5000 }); });
		// }
	},
};