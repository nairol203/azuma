const cooldowns = require('../models/cooldowns');

module.exports.setCooldown = async (userId, command, cooldown) => {
	await cooldowns.insertMany(
		{
			userId,
			command,
			cooldown,
		},
	);
};

module.exports.getCooldown = async (userId, command) => {
	const getCooldown = await cooldowns.findOne(
		{
			userId,
			command,
		},
	);
	if (!getCooldown) return undefined;
	const result = getCooldown.cooldown;
	return result;
};

async function updateCooldown() {
	const results = await cooldowns.find();
	if (results && results.length) {
		for (const result of results) {
			const { userId, command, cooldown } = result;
			if (cooldown <= 0) {
				await cooldowns.findOneAndDelete(
					{
						userId,
						command,
					},
				);
			}
			const newCooldown = cooldown - 10;
			await cooldowns.findOneAndUpdate(
				{
					userId,
					command,
				},
				{
					cooldown: newCooldown,
				},
			);
		}
	}
	setTimeout(updateCooldown, 10 * 1000);
}
updateCooldown;

module.exports.updateCooldown = updateCooldown;