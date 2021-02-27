const customsSchema = require('../../models/customs');

module.exports = {
	callback: async ({ message, args }) => {
		const { author, channel } = message;
		const song = args.join(' ');
		const userId = author.id;
		const data = await customsSchema.findOne({ userId });
		if (data.userId != userId) return;
		if (!data) return;
		if (data.textChannelId != channel.id) return;
		if (args[0] === 'save') {
			if (args[1] === '1') {
				const args1 = song.toString().replace('save 1 ', '');
				await customsSchema.findOneAndUpdate(
					{
						userId,
					},
					{
						userId,
						args1,
					},
				);
				channel.send(`Du hast ${args1} auf der 1 gespeichert!`);
			}
			else if (args[1] === '2') {
				const args2 = song.toString().replace('save 2 ', '');
				await customsSchema.findOneAndUpdate(
					{
						userId,
					},
					{
						userId,
						args2,
					},
				);
				channel.send(`Du hast ${args2} auf der 2 gespeichert!`);
			}
			else if (args[1] === '3') {
				const args3 = song.toString().replace('save 3 ', '');
				await customsSchema.findOneAndUpdate(
					{
						userId,
					},
					{
						userId,
						args3,
					},
				);
				channel.send(`Du hast ${args3} auf der 3 gespeichert!`);
			}
			else if (args[1] === '4') {
				const args4 = song.toString().replace('save 4 ', '');
				await customsSchema.findOneAndUpdate(
					{
						userId,
					},
					{
						userId,
						args4,
					},
				);
				channel.send(`Du hast ${args4} auf der 4 gespeichert!`);
			}
			else if (args[1] === '5') {
				const args5 = song.toString().replace('save 5 ', '');
				await customsSchema.findOneAndUpdate(
					{
						userId,
					},
					{
						userId,
						args5,
					},
				);
				channel.send(`Du hast ${args5} auf der 5 gespeichert!`);
			}
		}
		else if (args[0] === 'delete') {
			const args1 = undefined;
			const args2 = undefined;
			const args3 = undefined;
			const args4 = undefined;
			const args5 = undefined;
			if (args[1] === '1') {
				await customsSchema.findOneAndUpdate(
					{
						userId,
					},
					{
						userId,
						args1,
					},
				);
				channel.send('Du hast den ersten Slot zurückgesetzt!');
			}
			else if (args[1] === '2') {
				await customsSchema.findOneAndUpdate(
					{
						userId,
					},
					{
						userId,
						args2,
					},
				);
				channel.send('Du hast den zweiten Slot zurückgesetzt!');
			}
			else if (args[1] === '3') {
				await customsSchema.findOneAndUpdate(
					{
						userId,
					},
					{
						userId,
						args3,
					},
				);
				channel.send('Du hast den dritten Slot zurückgesetzt!');
			}
			else if (args[1] === '4') {
				await customsSchema.findOneAndUpdate(
					{
						userId,
					},
					{
						userId,
						args4,
					},
				);
				channel.send('Du hast den vierten Slot zurückgesetzt!');
			}
			else if (args[1] === '5') {
				await customsSchema.findOneAndUpdate(
					{
						userId,
					},
					{
						userId,
						args5,
					},
				);
				channel.send('Du hast den fünften Slot zurückgesetzt!');
			}
		}
	},
};