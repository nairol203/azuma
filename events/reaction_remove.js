module.exports = {
	name: 'messageReactionRemove',
	async run(reaction, user) {
		const { message, _emoji } = reaction;
		if (user.bot) return;
		if (message.channel.id == '782595813196038175') {
			if (_emoji.name == '🔔') {
				await message.guild.members.cache.get(user.id).roles.remove('796010383441133578');
			}
			if (_emoji.id == '825980549234950144') {
				await message.guild.members.cache.get(user.id).roles.remove('794708386930753586');
			}
			if (_emoji.id == '825980512493502484') {
				await message.guild.members.cache.get(user.id).roles.remove('816211689136848907');
			}
		}
		else {
			return;
		}
	},
};