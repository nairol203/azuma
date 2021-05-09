module.exports.create = (name, description, options, guildId) => {
	const app = client.api.applications(client.user.id);
	if (guildId) {
		app.guilds(guildId);
	}
	app.commands.post({
		data: {
			name: name,
			description: description,
			options: options
		},
	}).then(console.log(client.user.username + ' > Posted Slash-Command: ' + name));
}

module.exports.get = (guildId) => {
	const app = client.api.applications(client.user.id);
	if (guildId) {
		app.guilds(guildId);
	}
	return app.commands.get();
}

module.exports.createApiMessage = async (interaction, content) => {
	const { data, files } = await Discord.APIMessage.create(
		client.channels.resolve(interaction.channel_id),
		content,
	)
		.resolveData()
		.resolveFiles();

	return { ...data, files };
}

module.exports.reply = async (interaction, response, flags = 1) => {
	const content = await response
	let data = {
		content,
		flags
	};
	if (typeof content === 'object') {
		data = await this.createApiMessage(interaction, content);
	}

	client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4,
			data,
		},
	});
}