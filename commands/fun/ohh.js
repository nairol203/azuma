module.exports = {
	callback: ({ message }) => {
		message.delete();
		message.channel.send('https://www.tenor.co/zs2m.gif');
	},
};