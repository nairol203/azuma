const customs = require('../../../models/customs');

module.exports = {
	callback: async ({ message, args }) => {
		const { author, channel } = message;
		const userId = author.id;
		const data = await customs.findOne({ userId });
		if (data.userId != userId) return;
		if (!data) return;
		if (data.textChannelId != channel.id) return;

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
			channel.send('Du hast den fünften Slot zurückgesetzt!');
		}
	},
};