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

module.exports.mathCooldown = async (userId, type) => {
	const cooldown = await this.getCooldown(userId, type);
	if (!cooldown) {
		return 'Ready!';
	}
	let seconds = cooldown;
	const hours = Math.floor((seconds % (3600 * 24)) / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	seconds = Math.floor(seconds % 60);
	let result = '';
	if (hours) {
		result += hours + 'h ';
	}
	if (minutes) {
		result += minutes + 'm ';
	}
	if (seconds) {
		result += seconds + 's ';
	}
	return result;
};

module.exports.resetCooldown = async (userId, reset) => {
	if (reset === 'all') {
		await cooldowns.deleteMany(
			{
				userId,
			},
		);
	}
	else {
		await cooldowns.deleteOne(
			{
				userId,
				reset
			}
		)
	}
}

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