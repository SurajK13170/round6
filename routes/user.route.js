const {UserModel} = require('../models/user.model')
const express = require('express')
const userRouter = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

userRouter.post('/register', async (req, res) => {
    const { userName, email, password, avatar } = req.body;
    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(401).json({ msg: 'User with this email already exists' });
        }

        const existingUsername = await UserModel.findOne({ userName });
        if (existingUsername) {
            return res.status(401).json({ msg: 'Username is already taken' });
        }

        bcrypt.hash(password, 5, async (err, hash) => {
            const user = new UserModel({ userName, email, password: hash, avatar });
            await user.save();
            res.status(201).json({ msg: 'User Registered' });
        });
    } catch (err) {
        res.status(500).json({ error: 'Registration Failed!' });
    }
});

userRouter.post('/login', async(req, res)=>{
    const {email,password} = req.body
    try{
        const user = await UserModel.findOne({email})
        if(user){
            bcrypt.compare(password, user.password,(err, result)=>{
                if(result){
                    const token = jwt.sign({userID:user._id, user:user.userName}, 'Book_Managment')
                    res.status(201).json({msg:'Login Success!',"token":token})
                }else{
                    res.status(401).json({'msg':'wrong password!'})
                }
            })
        }else{
            res.status(401).json({'msg':'wrong password!'})
        }
    }catch(err){
        res.status(500).json({err:err.message})
    }
})

module.exports = {userRouter}