module.exports = {
	minArgs: 1,
	maxArgs: 1,
	expectedArgs: '<id>',
	callback: ({ message, args }) => {
		message.guild.members.unban(args[0])
			.then(() => {
				message.channel.send(`<:ja:767394811140374568> ${args[0]} ist nicht mehr gebannt.`);
			})
			.catch(error => {
				message.channel.send('<:no:767394810909949983> Error occured while running ban command.');
				console.error(error);
			});
	},
};