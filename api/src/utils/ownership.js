const ownerId = (owner) => owner?._id || owner;

const isOwner = (owner, userId) => String(ownerId(owner)) === String(userId);

module.exports = { ownerId, isOwner };
