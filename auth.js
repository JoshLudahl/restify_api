const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.authenticate = (email, password) => {
    return new Promise(async (resolve, reject) =>{
        try {
            //  Find user by email
            const user = await User.findOne({email});
            //  Compare passwords if found
            bcrypt.compare(password, user.password, (err, isMatch) =>{
                if (err) throw err;
                if(isMatch) {
                    //  Compare success
                    resolve(user);
                } else {
                    //  Compare failed
                    reject('Authentication failed')
                }
            });

        } catch(err) {
            //  Email not found (reject)
            reject('Authentication failed');
        }
    });
};