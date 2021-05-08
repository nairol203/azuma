const { yes, no } = require('../../emoji.json');

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
						message.channel.send(yes + ` ${user.tag} wurde gekickt.`);
					})
					.catch(error => {
						message.channel.send(no + ' Error occured while running kick command.');
						console.error(error);
					});
			}
		}
		else {
			message.channel.send(no + ' Dieser User ist nicht auf diesem Server!');
		}
	},
};