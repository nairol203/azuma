const mongoose = require('mongoose');
const mongoPath = process.env.MONGO_URI;

module.exports = async () => {
	await mongoose.connect(mongoPath, {
		keepAlive: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	});
	return mongoose;
};