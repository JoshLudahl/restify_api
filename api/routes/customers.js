const errors = require('restify-errors');
const Customer = require('../models/Customer');

module.exports = server => {

    //  Get All Customers
    server.get('/customers', async (req, res, next) => {
        try {
            const customers = await Customer.find({});
            res.send(customers);
            next();
        } catch (err) {
            return next(new errors.InvalidContentError);
        };
    });

    //  Get One Customers
    server.get('/customers/:id', async (req, res, next) => {
        try {
            const customer = await Customer.findById(req.params.id);
            res.send(customer);
            next();
        } catch (err) {
            return next(new errors.ResourceNotFoundError("Username/ID is invalid"));
        };
    });

    //  Add Customer
    server.post('/customers', async (req, res, next) => {
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects application/json"));
        }
        const {
            name,
            email,
            balance
        } = req.body;
        const customer = new Customer({
            name,
            email,
            balance
        });
        try {
            const newCustomer = await customer.save();
            res.send(201);
            next();
        } catch (err) {
            return next(new errors.InternalError(err.message));
        };
    });

    //  Update Customer
    server.put('/customers/:id', async (req, res, next) => {
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects application/json"));
        }

        try {
            const customer = await Customer.findOneAndUpdate({_id:req.params.id}, req.body);
            res.send(200);
            next();
        } catch (err) {
            return next(new errors.ResourceNotFoundError("Username/ID is invalid"));
        };
    });

    //  Delete a Customer
    server.del('/customers/:id', async (req, res, next) => {
        try {
            const customer = await Customer.findOneAndDelete({_id:req.params.id});
            res.send(204);
            next();
        } catch (err) {
            return next(new errors.ResourceNotFoundError("Username/ID is invalid"));
        };
    });



};