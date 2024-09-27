//const Users = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncWrapper = require('../middleware/async');
const {createCustomError} = require('../errors/custom_error');
const { fetchUser, createUser, loginUser } = require('../repository/user');

const signUp = asyncWrapper(async (req, res, next) => {
    const { 
        firstname, 
        lastname, 
        username, 
        email, 
        password, 
        phone,
        country,
        account_status,
    } = req.body;

    const emailExist = await fetchUser({ email });
    if (emailExist) {
        return next(createCustomError("This email already exists", 403));
    }

    // Generate salt and hash the password
   const salt = bcrypt.genSaltSync(10);
   const hashPassword = bcrypt.hashSync(password, salt);

    // Create a new user with hashed password
    const user = await createUser({
        firstname, 
        lastname, 
        username, 
        email, 
        phone,
        country,
        account_status,
        password: hashPassword
    });
    await user.save();
    // Send a success response with the new user details
    res.status(201).json({ data: user });
});
    
const login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if the user exists in the database
    const user = await loginUser({ email });
    if (!user) {
        return next(createCustomError("User not found", 404));
    }

    // Compare the entered password with the hashed password in the database
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return next(createCustomError("Invalid email or password", 400));
    }

    // Generate a JWT token for the authenticated user
    const generatedToken = jwt.sign(
        {
            id: user._id,
            email: user.email,
        },
        process.env.TOKEN, // Ensure you have TOKEN_SECRET in your environment variables
        { expiresIn: '1d' } // Token expires in 1 day
    );

    // Construct a result object to send back to the client
    const result = {
        id: user._id,
        email: user.email,
        token: generatedToken,
    };

    // Return the result with a 200 status
    return res.status(200).json({ result });
});



module.exports = {
    signUp,
    login
}
