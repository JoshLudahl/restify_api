const errors = require('restify-errors');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const auth = require('../../auth');
const jwt = require('jsonwebtoken');
const rjwt = require('restify-jwt-community');
const config = require('../../config');


module.exports = server => {

    //  Register User
    server.post('/register', (req, res, next) => {
        const {
            email,
            password,
            details
        } = req.body;

        const user = new User({
            email,
            password,
            details
        });

        //  Generate Salt and Hash
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, async (err, hash) => {
                user.password = hash;

                //  Save User
                try {
                    const newUser = await user.save();
                    console.log(`User created: ${newUser}`);
                    res.send(201);
                    next();
                } catch (err) {
                    return next(new errors.InternalError(err.message));
                }
            });
        });

    });

    //  Authenticate user
    server.post('/login', async (req, res, next) => {
        const {
            email,
            password
        } = req.body;
        try {
            //  Process authentication
            const user = await auth.authenticate(email, password);

            //  Apply JWT Token
            const jwt_token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
                expiresIn: '60m'
            });

            //  Respond with the token
            const {
                iat,
                exp
            } = jwt.decode(jwt_token);
            res.send({
                iat,
                exp,
                jwt_token
            });

            next();
        } catch (error) {

            //  Auth Failed
            return next(new errors.UnauthorizedError(error));
        }
    });

    //  Delete ONE user by ID
    server.del('/user/:id', async (req, res, next) => {
        try {
            const user = await User.findOneAndRemove({
                _id: req.params.id
            });
            res.send(204);
            next();
        } catch (error) {
            return next(new errors.ResourceNotFoundError('User not found.'));
        };
    });

    //  Get ALL users
    //  Use JWT Community to secure route
    server.get('/users',
        rjwt({
            secret: config.JWT_SECRET
        }),
        async (req, res, next) => {

            //  Inquire data
            try {
                const users = await User.find();
                res.send(users);
                next();
            } catch (error) {
                return next(new errors.ResourceNotFoundError(error.message));
            }
        });

    //  Update user by ID
    server.put('/user/:id', async (req, res, next) => {
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects application/json"));
        }
        try {

            /*
                Currently cannot update without replacing an array, will need to work in a
                Will add in next
            */
            const user = await User.findOneAndUpdate({
                _id: req.params.id
            }, req.body);
            console.log(req.body);
            res.send(200);
            next();
        } catch (err) {
            return next(new errors.ResourceNotFoundError("Username/ID is invalid"));
        };
    });
};