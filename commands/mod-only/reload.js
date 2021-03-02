const fs = require('fs');
module.exports = {
	description: 'Reloads a command',
	minArgs: 1,
	maxArgs: 1,
	expectedArgs: '<command>',
	callback: ({ message, args }) => {
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
		}

		const commandFolders = fs.readdirSync('./commands');
		const folderName = commandFolders.find(folder => fs.readdirSync(`./commands/${folder}`).includes(`${commandName}.js`));

		delete require.cache[require.resolve(`../${folderName}/${commandName}.js`)];

		try {
			const newCommand = require(`../${folderName}/${commandName}.js`);
			message.client.commands.set(commandName, newCommand);
			message.channel.send(`Command \`${commandName}\` was reloaded!`);
		}
		catch (error) {
			console.error(error);
			message.channel.send(`There was an error while reloading a command \`${commandName}\`:\n\`${error.message}\``);
		}
	},
};