const textChannelSchema = require('../schemas/textchannel-schema');

module.exports.addChannel = async (guildId, userId, channelId) => {
	const result = await textChannelSchema.findOneAndUpdate(
		{
			guildId,
			userId,
		},
		{
			guildId,
			userId,
			channelId,
		},
		{
			upsert: true,
			new: true,
		},
	);

	return result;
};