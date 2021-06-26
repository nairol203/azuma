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
						message.reply(`${user.tag} wurde gekickt.`);
					})
					.catch(error => {
						message.reply('Error occured while running kick command.');
						console.error(error);
					});
			}
		}
		else {
			message.reply('Dieser User ist nicht auf diesem Server!');
		}
	},
};