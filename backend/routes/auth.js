const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { validationResult, body } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');// for token
const authMiddleware = require('../middleware/authMiddleware');


// secret key always in .env file
const jwt_secure = 'mynameisabhi'; //for token 

// createuser post method // no login required -----
router.post('/create-user',
    [
        body('email', 'Enter a valid Email').isEmail(),
        body('password', 'Enter a valid Password').isLength({ min: 5 }),
        body('name', 'Enter a valid Name').isLength({ min: 3 })
    ]
    , async (req, res) => {
        try {
            // if result is not null means some error are in validation 
            const result = validationResult(req);
            if (!result.isEmpty()) {
                return res.send({ errors: result.array() });
            }

            // existing user
            let user = await User.findOne({ email: req.body.email });
            // if user already exist then return some error message 
            if (user) {
                return res.send({
                    error: 'Email Already registered !'
                })
            }

            // password hashing to secure password 
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            // if there is not existing user then create new user 
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
            })
            console.log(user);

            // set user _id in data // for token 
            const data = {
                user: {
                    id: user.id
                }
            }
            // return token 
            const authToken = jwt.sign(data, jwt_secure);
            // console.log(authToken);

            res.send({
                success: true,
                message: 'Successfully User created ! ',
                authToken
            })
        }

        catch (error) {
            console.log(error);
            res.send({
                success: false,
                message: 'Error in user create page ! '
            })
        }
    })




router.post('/login',
    [
        body('email', 'Enter a valid Email').isEmail(),
        body('password', 'Enter a valid Password').isLength({ min: 1 }),
    ],
    async (req, res) => {
        try {
            // if result is not null means some error are in validation 
            const result = validationResult(req);
            if (!result.isEmpty()) {
                return res.send({ errors: result.array() });
            }

            const { email, password } = req.body;
            const existingUser = await User.findOne({ email: req.body.email });
            if (!existingUser) {
                return res.send({
                    success: false,
                    message: 'Email is not registered !'
                })
            }

            // compare password if user is correct 
            const comparePassword = await bcrypt.compare(password, existingUser.password);
            if (!comparePassword) {
                return res.send({
                    success: false,
                    message: 'Invalide Password !'
                })
            }

            const data = {
                user: {
                    id: existingUser.id
                }
            }
            // return token 
            const authToken = jwt.sign(data, jwt_secure);
            res.send({
                success: true,
                message: 'Successfully login  ! ',
                authToken
            })
        } catch (error) {
            console.log(error);
            res.send({
                success: false,
                message: 'Error in login page ! '
            })
        }
    })

//get user details login required -----
router.post('/getuser',authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select("-password")
        res.send({
            success: true,
            message: 'user get successfully !',
            user
        })
    }
    catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: 'Error in Current user !'
        })
    }
})
module.exports = router