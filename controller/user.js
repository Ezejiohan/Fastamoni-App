const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncWrapper = require('../middleware/async');
const { createCustomError } = require('../errors/custom_error');
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

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

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

    res.status(201).json({ data: user });
});

const login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await loginUser({ email });
    if (!user) {
        return next(createCustomError("User not found", 404));
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return next(createCustomError("Invalid email or password", 400));
    }

    const generatedToken = jwt.sign(
        {
            id: user._id,
            email: user.email,
        },
        process.env.TOKEN, { expiresIn: '1d' }
    );
    const result = {
        id: user._id,
        email: user.email,
        token: generatedToken,
    };

    return res.status(200).json({ result });
});

module.exports = { signUp, login };
