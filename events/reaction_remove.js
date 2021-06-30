module.exports = {
	name: 'messageReactionRemove',
	async run(reaction, user) {
		const { message, _emoji } = reaction;
		if (user.bot) return;
		if (message.channel.id == '782595813196038175') {
			if (_emoji.id == '859837191156006932') {
				await message.guild.members.cache.get(user.id).roles.add('859837772490866768');
			}
			if (_emoji.id == '859837337554386975') {
				await message.guild.members.cache.get(user.id).roles.add('859837729113899089');
			}
			if (_emoji.id == '825980549234950144') {
				await message.guild.members.cache.get(user.id).roles.add('794708386930753586');
			}
			if (_emoji.id == '825980512493502484') {
				await message.guild.members.cache.get(user.id).roles.add('816211689136848907');
			}
			if (_emoji.name == '🔔') {
				await message.guild.members.cache.get(user.id).roles.add('859771979845337098');
			}
		}
		else {
			return;
		}
	},
};