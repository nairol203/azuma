module.exports = {
	minArgs: 1,
	maxArgs: 1,
	expectedArgs: '<id>',
	callback: ({ message, args }) => {
		message.guild.members.unban(args[0])
			.then(() => {
				message.reply(`${args[0]} ist nicht mehr gebannt.`);
			})
			.catch(error => {
				message.reply('Error occured while running ban command.');
				console.error(error);
			});
	},
};