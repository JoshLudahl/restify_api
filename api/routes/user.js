const errors = require('restify-errors');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const auth = require('../../auth');
const jwt = require('jsonwebtoken');
const config = require('../../config');


module.exports = server => {

    //  Register User
    server.post('/register', (req, res, next) =>{
        const { email, password } = req.body;

        const user = new User({
            email,
            password
        });

        //  Generate Salt and Hash
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, async (err, hash) => {
                user.password = hash;

                //  Save User
                try {
                    const newUser = await user.save();
                    res.send(201);
                    next();
                } catch(err) {
                    return next(new errors.InternalError(err.message));
                }
            });
        });

    });


    // Authenticate user
    server.post('/auth', async (req, res, next) =>{
        const { email, password } = req.body;
        try {
            //  Process authentication
            const user = await auth.authenticate(email, password);

            //  Apply JWT Token
            const jwt_token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
                expiresIn: '15m'
            });

            //  Respond with the token
            const {iat, exp } = jwt.decode(jwt_token);
            res.send({iat, exp, jwt_token});

            next();
        } catch (error) {

            //  Auth Failed
            return next(new errors.UnauthorizedError(error));
        }
    });


};