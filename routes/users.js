const express = require('express');
const { signUp, 
    login
} = require('../controller/user');
   

const route = express.Router();

route.post('/register', (signUp));
route.post('/login', (login));

module.exports = route;
