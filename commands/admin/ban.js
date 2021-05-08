const { yes, no } = require('../../emoji.json');

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
						message.channel.send(yes + ` ${user.tag} wurde gebannt.`);
					})
					.catch(error => {
						message.channel.send(no + ' Error occured while running ban command.');
						console.error(error);
					});
			}
		}
		else {
			message.channel.send(no + ' Dieser User ist nicht auf diesem Server!');
		}
	},
};