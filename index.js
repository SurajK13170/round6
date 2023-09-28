const express = require('express')
const {connection} = require('./db')
const mongoose = require('mongoose')
const cors = require('cors')
const {userRouter} = require('./routes/user.route')
const {blogRoute} = require('./routes/blog.route')


const app = express()
require('dotenv').config()
app.use(express.json())
app.use(cors())


const PORT = 8080

app.use('/api', userRouter)
app.use('/api', blogRoute)




app.listen(`${PORT}`, async(req, res)=>{
    try{
        connection
        console.log('Connected to DB')

    }catch(err){
        console.log('Not Connected')
    }
    console.log(`Server is Running at Port ${PORT}`)
})