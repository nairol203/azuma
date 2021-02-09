const textChannelSchema = require('../schemas/textchannel-schema');

module.exports.addChannel = async (guildId, userId, channelId) => {
	const result = await textChannelSchema.insertMany(
		{
			guildId,
			userId,
			channelId,
		},
	);

	return result;
};