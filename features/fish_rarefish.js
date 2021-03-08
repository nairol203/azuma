const rarefishSchema = require('../models/fish_rarefish');

const collection = {
	penguin: '🐧',
	turtle: '🐢',
	octopus: '🐙',
	squid: '🦑',
	shrimp: '🦐',
	crab:'🦀',
	blowfish: '🐡',
	dolphin: '🐬',
	whale: '🐳',
	whale2: '🐋',
	shark: '🦈',
	crocodile: '🐊',
};

module.exports.collection = collection;

module.exports.setDefault = async (userId) => {
	await rarefishSchema.findOneAndUpdate(
		{
			userId,
		},
		{
			userId,
			penguin: false,
			turtle: false,
			octopus: false,
			squid: false,
			shrimp: false,
			crab: false,
			blowfish: false,
			dolphin: false,
			whale: false,
			whale2: false,
			shark: false,
			crocodile: false,
		},
		{
			upsert: true,
			new: true,
		},
	);
};

module.exports.check = async (userId) => {
	const result = await rarefishSchema.findOne({ userId });
	return result;
};

module.exports.resultRarefish = async (userId) => {
	const rarefish = await this.check(userId);

	let result = [];
	const nullResult = '/';

	if (rarefish === null) return nullResult;

	if (rarefish.penguin === true) result = collection.penguin;
	if (rarefish.turtle === true) result = result + collection.turtle;
	if (rarefish.octopus === true) result = result + collection.octopus;
	if (rarefish.squid === true) result = result + collection.squid;
	if (rarefish.shrimp === true) result = result + collection.shrimp;
	if (rarefish.crab === true) result = result + collection.crab;
	if (rarefish.blowfish === true) result = result + collection.blowfish;
	if (rarefish.dolphin === true) result = result + collection.dolphin;
	if (rarefish.whale === true) result = result + collection.whale;
	if (rarefish.whale2 === true) result = result + collection.whale2;
	if (rarefish.shark === true) result = result + collection.shark;
	if (rarefish.crocodile === true) result = result + collection.crocodile;

	return result;
};

module.exports.checkArg = async (arg) => {
	if(arg === collection.penguin) return 'penguin';
	if(arg === collection.turtle) return 'turtle';
	if(arg === collection.octopus) return 'octopus';
	if(arg === collection.squid) return 'squid';
	if(arg === collection.shrimp) return 'shrimp';
	if(arg === collection.crab) return 'crab';
	if(arg === collection.blowfish) return 'blowfish';
	if(arg === collection.dolphin) return 'dolphin';
	if(arg === collection.whale) return 'whale';
	if(arg === collection.whale2) return 'whale2';
	if(arg === collection.shark) return 'shark';
	if(arg === collection.crocodile) return 'crocodile';
};

module.exports.redeemPenguin = async (userId) => {
	await rarefishSchema.findOneAndUpdate(
		{
			userId,
			penguin: true,
		},
		{
			userId,
			penguin: false,
		},
	);
};

module.exports.redeemTurtle = async (userId) => {
	await rarefishSchema.findOneAndUpdate(
		{
			userId,
		},
		{
			userId,
			turtle: false,
		},
	);
};

module.exports.redeemOctopus = async (userId) => {
	await rarefishSchema.findOneAndUpdate(
		{
			userId,
		},
		{
			userId,
			octopus: false,
		},
	);
};

module.exports.redeemSquid = async (userId) => {
	await rarefishSchema.findOneAndUpdate(
		{
			userId,
		},
		{
			userId,
			squid: false,
		},
	);
};

module.exports.redeemShrimp = async (userId) => {
	await rarefishSchema.findOneAndUpdate(
		{
			userId,
		},
		{
			userId,
			shrimp: false,
		},
	);
};

module.exports.redeemCrab = async (userId) => {
	await rarefishSchema.findOneAndUpdate(
		{
			userId,
		},
		{
			userId,
			crab: false,
		},
	);
};

module.exports.redeemBlowfish = async (userId) => {
	await rarefishSchema.findOneAndUpdate(
		{
			userId,
		},
		{
			userId,
			blowfish: false,
		},
	);
};

module.exports.redeemDolphin = async (userId) => {
	await rarefishSchema.findOneAndUpdate(
		{
			userId,
		},
		{
			userId,
			dolphin: false,
		},
	);
};

module.exports.redeemWhale = async (userId) => {
	await rarefishSchema.findOneAndUpdate(
		{
			userId,
		},
		{
			userId,
			whale: false,
		},
	);
};

module.exports.redeemWhale2 = async (userId) => {
	await rarefishSchema.findOneAndUpdate(
		{
			userId,
		},
		{
			userId,
			whale2: false,
		},
	);
};

module.exports.redeemShark = async (userId) => {
	await rarefishSchema.findOneAndUpdate(
		{
			userId,
		},
		{
			userId,
			shark: false,
		},
	);
};

module.exports.redeemCrocodile = async (userId) => {
	await rarefishSchema.findOneAndUpdate(
		{
			userId,
		},
		{
			userId,
			crocodile: false,
		},
	);
};