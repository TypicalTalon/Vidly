const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const express = require('express');
const lodash = require('lodash');
const router = express.Router();
const Joi = require('joi');
const { User } = require('../modules/user');


router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password');

    const token = user.generateAuthToken();
    res.send(token);
});

function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(req, schema);
}
module.exports = router;