const fs = require('fs');
module.exports = {
	slash: true,
	description: 'Reloads a command',
	options: [
		{
			name: 'Command',
			description: 'Gebe einen Command an den du reloaden willst',
			type: 3,
			required: true,
		},
	],
	requiredPermissions: ['ADMINISTRATOR'],
	callback: ({ client, interaction, args }) => {
		const userId = interaction.member.user.id;
		const commandName = args.command;
		const command = client.commands.get(commandName)
			|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return `There is no command with name or alias \`${commandName}\`, <@` + userId + '>!';
		}

		const commandFolders = fs.readdirSync('./commands');
		const folderName = commandFolders.find(folder => fs.readdirSync(`./commands/${folder}`).includes(`${commandName}.js`));

		delete require.cache[require.resolve(`../${folderName}/${commandName}.js`)];

		try {
			const newCommand = require(`../${folderName}/${commandName}.js`);
			client.commands.set(commandName, newCommand);
			return `Command \`${commandName}\` was reloaded!`;
		}
		catch (error) {
			console.error(error);
			return `There was an error while reloading a command \`${commandName}\`:\n\`${error.message}\``;
		}
	},
};