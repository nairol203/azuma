const { MessageEmbed } = require('discord.js');
const customs = require('../../models/customs');

module.exports = {
	guildOnly: true,
	description: 'Löscht einen Song aus der Jukebox',
	options: [
		{
			name: 'slot',
			description: 'Slot der Jukebox',
			type: 4,
			required: true,
		}
	],
	callback: async ({ client, args, interaction }) => {
		const userId = interaction.member.user.id;
		const channelId = interaction.channel_id;
		const slot = args.slot;
		const data = await customs.findOne({ userId });
		if (!data) return 'Err0';
		if (data.userId =! userId) return 'Err1';
		if (data.textChannelId != channelId) return 'Err2';
		const channel = client.channels.cache.get(channelId)
		const msg = await channel.messages.fetch(data.jukeboxId);

		let field1 = data.args1;
		if (!field1) field1 = '/';
		let field2 = data.args2;
		if (!field2) field2 = '/';
		let field3 = data.args3;
		if (!field3) field3 = '/';
		let field4 = data.args4;
		if (!field4) field4 = '/';
		let field5 = data.args5;
		if (!field5) field5 = '/';

		const embed = new MessageEmbed()
			.setTitle('Jukebox')
			.setDescription('Du kannst dir deine Lieblingssong abspeichern\nund diese dann per Shortcut abspielen!')
			.addFields(
				{ name: 'Speichere Songs:', value: '`/save <number> <song>`', inline: true },
				{ name: 'Lösche Songs:', value: '`/delete <number>`', inline: true },
			)
			.setFooter('Du kannst maximal fünf Songs abspeichern!')
			.setColor('#f77600');

		if (slot == 1) {
			const args1 = undefined
			await customs.findOneAndUpdate(
				{
					userId,
				},
				{
					userId,
					args1,
				},
			);
			field1 = '/';
		}
		if (slot == 2) {
			const args2 = undefined
			await customs.findOneAndUpdate(
				{
					userId,
				},
				{
					userId,
					args2,
				},
			);
			field2 = '/';
		}
		if (slot == 3) {
			const args3 = undefined
			await customs.findOneAndUpdate(
				{
					userId,
				},
				{
					userId,
					args3,
				},
			);
			field3 = '/';
		}
		if (slot == 4) {
			const args4 = undefined
			await customs.findOneAndUpdate(
				{
					userId,
				},
				{
					userId,
					args4,
				},
			);
			field4 = '/';
		}
		if (slot == 5) {
			const args5 = undefined
			await customs.findOneAndUpdate(
				{
					userId,
				},
				{
					userId,
					args5,
				},
			);
			field5 = '/';
		}
		embed.addField('Deine gespeicherten Songs:', `:one: ${field1}\n:two: ${field2}\n:three: ${field3}\n:four: ${field4}\n:five: ${field5}`)
		msg.edit(embed)
		return `Du hast Slot ${slot} zurückgesetzt!`;
	},
};