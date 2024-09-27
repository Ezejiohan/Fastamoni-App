const User = require("../models/user")

exports.fetchUser = async (options) => {
    return await User.findOne(options)
};

exports.createUser = async (options) => {
    return await User.create(options)
};

exports.loginUser = (options) => {
    return User.findOne(options)
};

exports.fetchUserById = (options) => {
    return User.findById(options)
};
