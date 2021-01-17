const mongo = require('../mongo');
const profileSchema = require('../schemas/profile-schema');
// const cooldowns = new Set();


module.exports = (client) => {
	client.on('message', (message) => {
		if(message.author.bot) return;

		/* if (cooldowns.has(message.author.id)) return;

		cooldowns.add(message.author.id);

		setTimeout(() => cooldowns.delete(message.author.id), 60000);*/

		addXP(message.member.id, 20, message);
	});
};

const getNeededXP = (level) => level * level * 100;

const addXP = async (userId, xpToAdd, message) => {
	await mongo().then(async (mongoose) => {
		try {
			const result = await profileSchema.findOneAndUpdate(
				{
					userId,
				},
				{
					userId,
					$inc: {
						xp: xpToAdd,
					},
				},
				{
					upsert: true,
					new: true,
				},
			);

			let { xp, level } = result;
			const needed = getNeededXP(level);

			if (xp >= needed) {
				++level;
				xp -= needed;

				message.reply(`du bist jetzt Level ${level}!`);

				await profileSchema.updateOne(
					{
						userId,
					},
					{
						level,
						xp,
					},
				);
			}
		}
		finally {
			mongoose.connection.close();
		}
	});
};

module.exports.addXP = addXP;