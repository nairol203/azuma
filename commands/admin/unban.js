const { yes, no } = require('../../emoji.json');

module.exports = {
	minArgs: 1,
	maxArgs: 1,
	expectedArgs: '<id>',
	requiredPermissions: ['BAN_MEMBERS'],
	callback: ({ message, args }) => {
		message.guild.members.unban(args[0])
			.then(() => {
				message.channel.send(yes + ` ${args[0]} ist nicht mehr gebannt.`);
			})
			.catch(error => {
				message.channel.send(no + ' Error occured while running ban command.');
				console.error(error);
			});
	},
};