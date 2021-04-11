module.exports = {
	expectedArgs: '<member>',
	minArgs: 1,
	maxArgs: 1,
	callback: ({ message }) => {
		const user = message.mentions.users.first();
		if (user) {
			const member = message.guild.members.resolve(user);
			if (member) {
				member
					.ban()
					.then(() => {
						message.channel.send(`<:ja:767394811140374568> ${user.tag} wurde gebannt.`);
					})
					.catch(error => {
						message.channel.send('<:no:767394810909949983> Error occured while running ban command.');
						console.error(error);
					});
			}
		}
		else {
			message.channel.send('<:no:767394810909949983> Dieser User ist nicht auf diesem Server!');
		}
	},
};