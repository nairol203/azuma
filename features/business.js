const businessSchema = require('../models/business');
const { upgrades, documents, weed, fakeMoney, meth, cocaine } = require('./business.json');

module.exports.getInfo = (type) => {
	if (type === 1) return documents;
	if (type === 2) return weed;
	if (type === 3) return fakeMoney;
	if (type === 4) return meth;
	if (type === 5) return cocaine;
	if (type === 'upgrades') return upgrades;
};

module.exports.getBusiness = async (userId) => {
	const business = await businessSchema.findOne(
		{
			userId,
		},
	);
	return business;
};

module.exports.buyBusiness = async (userId, type) => {
	await businessSchema.findOneAndUpdate(
		{
			userId,
		},
		{
			userId,
			type,
			upgrade1: false,
			upgrade2: false,
			upgrade3: false,
		},
		{
			upsert: true,
			new: true,
		},
	);
};

module.exports.buyUpgrade1 = async (userId, type) => {
	await businessSchema.findOneAndUpdate(
		{
			userId,
			type,
		},
		{
			userId,
			type,
			upgrade1: true,
		},
		{
			upsert: true,
			new: true,
		},
	);
};

module.exports.buyUpgrade2 = async (userId, type) => {
	await businessSchema.findOneAndUpdate(
		{
			userId,
			type,
		},
		{
			userId,
			type,
			upgrade2: true,
		},
		{
			upsert: true,
			new: true,
		},
	);
};

module.exports.buyUpgrade3 = async (userId, type) => {
	await businessSchema.findOneAndUpdate(
		{
			userId,
			type,
		},
		{
			userId,
			type,
			upgrade3: true,
		},
		{
			upsert: true,
			new: true,
		},
	);
};

module.exports.setCompany = async (userId) => {
	const getBusiness = await this.getBusiness(userId);
	if (!getBusiness) {
		return undefined
	}
	let company;
	if (getBusiness.type === 'Dokumentenfälscherei') company = documents;
	if (getBusiness.type === 'Hanfplantage') company = weed;
	if (getBusiness.type === 'Geldfälscherei') company = fakeMoney;
	if (getBusiness.type === 'Methproduktion') company = meth;
	if (getBusiness.type === 'Kokainproduktion') company = cocaine;

	return company;
};

module.exports.checkProfit = async (userId) => {
	const getBusiness = await this.getBusiness(userId);
	const company = await this.setCompany(userId);

	const upgrade1 = company.profit * upgrades.upgrade1;
	const upgrade2 = company.profit * upgrades.upgrade2;
	const upgrade3 = company.profit * upgrades.upgrade3;

	let checkUpgrade1 = 0;
	if (getBusiness.upgrade1 === true) checkUpgrade1 = upgrade1;
	let checkUpgrade2 = 0;
	if (getBusiness.upgrade2 === true) checkUpgrade2 = upgrade2;
	let checkUpgrade3 = 0;
	if (getBusiness.upgrade3 === true) checkUpgrade3 = upgrade3;

	const profit = company.profit + checkUpgrade1 + checkUpgrade2 + checkUpgrade3;

	return profit;
};