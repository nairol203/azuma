const customsSchema = require('../../../models/customs');

module.exports = {
	callback: async ({ message, args }) => {
		const { author, channel } = message;
		const song = args.join(' ');
		const userId = author.id;
		const data = await customsSchema.findOne({ userId });
		if (data.userId != userId) return;
		if (!data) return;
		if (data.textChannelId != channel.id) return;
		if (args[0] === '1') {
			const args1 = song.toString().replace('1 ', '');
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
		else if (args[0] === '2') {
			const args2 = song.toString().replace('2 ', '');
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
		else if (args[0] === '3') {
			const args3 = song.toString().replace('3 ', '');
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
		else if (args[0] === '4') {
			const args4 = song.toString().replace('4 ', '');
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
		else if (args[0] === '5') {
			const args5 = song.toString().replace('5 ', '');
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

	},
};