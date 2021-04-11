module.exports = {
	minArgs: 1,
	maxArgs: 1,
	expectedArgs: '<member>',
	callback: ({ message }) => {
		const user = message.mentions.users.first();
		if (user) {
			const member = message.guild.members.resolve(user);
			if (member) {
				member
					.kick()
					.then(() => {
						message.channel.send(`<:ja:767394811140374568> ${user.tag} wurde gekickt.`);
					})
					.catch(error => {
						message.channel.send('<:no:767394810909949983> Error occured while running kick command.');
						console.error(error);
					});
			}
		}
		else {
			message.channel.send('<:no:767394810909949983> Dieser User ist nicht auf diesem Server!');
		}
	},
};