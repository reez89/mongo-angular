const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


const router = express.Router();

router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password,10).then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save().then(result => {
            res.status(201).json({
                message: 'User created!',
                result: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
    })
})

router.post('/login', (req, res, next) => {
    let userData;
    User.findOne({ email: req.body.email })
        .then(user=>{
        if(!user){
            return res.status(401).json({
                message: 'User not found'
            });
        }
        userData = user;
        return bcrypt.compare(req.body.password, user.password)
    })
    .then(result => {
        if(!result){
            return res.status(401).json({
                message: 'User not found'
           });
        };
        const token = jwt.sign(
            {email: userData.email, userId: userData._id}, 
            'secret_this_is_a_try', 
            { expiresIn: '1h' }
        );
        res.status(200).json({
            token: token,
            expiresIn: 3600
        })
    })
    .catch(err => {
        return res.status(401).json({
            message: 'Auth failed'
        })
    })    
})

module.exports = router;