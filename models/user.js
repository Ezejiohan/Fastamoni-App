const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        require: true
    },
    lastname: {
        type: String,
        require: true
    },
    username: {
        type: String,
        reuire: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true    
    },
    country: {
        type: String,
        require: true
    },
    account_status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
});

const User = mongoose.model('users', userSchema);
module.exports = User;