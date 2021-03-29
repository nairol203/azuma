const profile = require('../models/profile');
const commons = require('../models/commons');
const uncommons = require('../models/uncommons');
const rares = require('../models/rares');
const garbage = require('../models/garbage');

module.exports.findCommon = async (userId, name) => {
    const result = await commons.findOne({ userId, name });
    return result;
}

module.exports.findUncommon = async (userId, name) => {
    const result = await uncommons.findOne({ userId, name });
    return result;
}

module.exports.findRare = async (userId, name) => {
    const result = await rares.findOne({ userId, name });
    return result;
}

module.exports.findGarbage = async (userId, name) => {
    const result = await garbage.findOne({ userId, name });
    return result;
}

module.exports.addCommon = async (userId, name, emoji, amount, length) => {
    const save = await this.findCommon(userId, name);
    let newLength = length;
    if (save) {
        if (save.length > length) newLength = save.length;
    }
    await commons.findOneAndUpdate(
        {
            userId,
            name,
        },
        {
            userId,
            name,
            emoji,
            $inc: {
                amount,
            },
            length: newLength,
        },
        {
            upsert: true,
            new: true,
        }
    );
};

module.exports.addUncommon = async (userId, name, emoji, amount, length) => {
    const save = await this.findUncommon(userId, name);
    let newLength = length;
    if (save) {
        if (save.length > length) newLength = save.length;
    }
    await uncommons.findOneAndUpdate(
        {
            userId,
            name,
        },
        {
            userId,
            name,
            emoji,
            $inc: {
                amount,
            },
            length: newLength,
        },
        {
            upsert: true,
            new: true,
        }
    );
};

module.exports.addRare = async (userId, name, emoji, amount, length) => {
    const save = await this.findRare(userId, name);
    let newLength = length;
    if (save) {
        if (save.length > length) newLength = save.length;
    }
    await rares.findOneAndUpdate(
        {
            userId,
            name,
        },
        {
            userId,
            name,
            emoji,
            $inc: {
                amount,
            },
            length: newLength,
        },
        {
            upsert: true,
            new: true,
        }
    );
};

module.exports.addGarbage = async (userId, name, emoji, amount) => {
    await garbage.findOneAndUpdate(
        {
            userId,
            name,
        },
        {
            userId,
            name,
            emoji,
            $inc: {
                amount,
            },
        },
        {
            upsert: true,
            new: true,
        }
    );
};

module.exports.setRod = async (userId, rod, rod_durability) => {
    await profile.findOneAndUpdate(
        {
            userId,
        },
        {
            userId,
            rod,
        },
        {
            upsert: true,
            new: true,
        },
    );
};

module.exports.addBagSize = async (userId, bag_size) => {
    await profile.findOneAndUpdate(
        {
            userId,
        },
        {
            userId,
            $inc: {
                bag_size,
            },
        },
        {
            upsert: true,
            new: true,
        }
    );
};

module.exports.addBagValue = async (userId, bag_value) => {
    await profile.findOneAndUpdate(
        {
            userId,
        },
        {
            userId,
            $inc: {
                bag_value,
            },
        },
        {
            upsert: true,
            new: true,
        }
    );
};

module.exports.activeBait = async (userId, bait) => {
    await profile.findOneAndUpdate(
        {
            userId,
        },
        {
            userId,
            active_bait: bait,
        },
        {
            upsert: true,
            new: true,
        },
    );
};

module.exports.getStats = async (userId) => {
    const fCommon = await commons.find({userId});
    const fUncommon = await uncommons.find({userId});
    const fRares = await rares.find({userId});
    const fGarbage = await garbage.find({userId});
    let two = fCommon.concat(fUncommon);
    let three = two.concat(fRares);
    let all = three.concat(fGarbage);
    return all;
}

module.exports.getCommonStats = async (userId) => {
    const result = await commons.find({userId});
    return result;
}

module.exports.getUncommonStats = async (userId) => {
    const result = await uncommons.find({userId});
    return result;
}

module.exports.getRareStats = async (userId) => {
    const result = await rares.find({userId});
    return result;
}

module.exports.getGarbageStats = async (userId) => {
    const result = await garbage.find({userId});
    return result;
}