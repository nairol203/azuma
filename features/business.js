const businessSchema = require('../schemas/business');

const upgrades = {
	upgrade1: 0.1,
	upgrade2: 0.2,
	upgrade3: 0.4,
};

const documents = {
	name: 'Dokumentenfälscherei',
	price: 25000,
	priceUpgrade1: 1000,
	priceUpgrade2: 2000,
	priceUpgrade3: 3000,
	nameUpgrade3: 'Bessere Pressen',
	textUpgrade3: 'verbesserte Pressen',
	profit: 1000,
};

const weed = {
	name: 'Hanfplantage',
	price: 50000,
	priceUpgrade1: 5000,
	priceUpgrade2: 10000,
	priceUpgrade3: 15000,
	nameUpgrade3: 'UV-Lampen',
	textUpgrade3: 'UV-Lampen',
	profit: 5000,
};

const fakeMoney = {
	name: 'Geldfälscherei',
	price: 250000,
	priceUpgrade1: 20000,
	priceUpgrade2: 40000,
	priceUpgrade3: 60000,
	nameUpgrade3: 'Laserdrucker',
	textUpgrade3: 'einen Laserdrucker',
	profit: 20000,
};

const meth = {
	name: 'Methproduktion',
	price: 1000000,
	priceUpgrade1: 80000,
	priceUpgrade2: 100000,
	priceUpgrade3: 120000,
	nameUpgrade3: 'Destillationsanlage',
	textUpgrade3: 'eine Destillationsanlage',
	profit: 50000,
};

const cocaine = {
	name: 'Kokainproduktion',
	price: 2500000,
	priceUpgrade1: 150000,
	priceUpgrade2: 200000,
	priceUpgrade3: 250000,
	nameUpgrade3: 'Mehr Arbeitsfläche',
	textUpgrade3: 'mehr Arbeitfäche',
	profit: 100000,
};

module.exports.getInfo = (type) => {
	if (type === 1) return documents;
	if (type === 2) return weed;
	if (type === 3) return fakeMoney;
	if (type === 4) return meth;
	if (type === 5) return cocaine;
	if (type === 'upgrades') return upgrades;
};

module.exports.getBusiness = async (guildId, userId) => {
	const business = await businessSchema.findOne(
		{
			guildId,
			userId,
		},
	);
	return business;
};

module.exports.buyBusiness = async (guildId, userId, type) => {
	await businessSchema.findOneAndUpdate(
		{
			guildId,
			userId,
		},
		{
			guildId,
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

module.exports.buyUpgrade1 = async (guildId, userId, type) => {
	await businessSchema.findOneAndUpdate(
		{
			guildId,
			userId,
			type,
		},
		{
			guildId,
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

module.exports.buyUpgrade2 = async (guildId, userId, type) => {
	await businessSchema.findOneAndUpdate(
		{
			guildId,
			userId,
			type,
		},
		{
			guildId,
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

module.exports.buyUpgrade3 = async (guildId, userId, type) => {
	await businessSchema.findOneAndUpdate(
		{
			guildId,
			userId,
			type,
		},
		{
			guildId,
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

module.exports.setCompany = async (guildId, userId) => {
	const getBusiness = await this.getBusiness(guildId, userId);

	let company = [];
	if (getBusiness.type === 'Dokumentenfälscherei') company = documents;
	if (getBusiness.type === 'Handplantage') company = weed;
	if (getBusiness.type === 'Geldfälscherei') company = fakeMoney;
	if (getBusiness.type === 'Methproduktion') company = meth;
	if (getBusiness.type === 'Kokainproduktion') company = cocaine;

	return company;
};

module.exports.checkProfit = async (guildId, userId) => {
	const getBusiness = await this.getBusiness(guildId, userId);
	const company = await this.setCompany(guildId, userId);

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