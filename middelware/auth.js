const jwt = require('jsonwebtoken')

const auth = (req, res, next)=>{
    const token = req.headers.authorization
    if(token){
        try{
            const decoded = jwt.verify(token.split(" ")[1], 'Book_Managment')
            if(decoded){
                console.log(decoded)
                req.body.userName = decoded.user
                
                next()
            }else{
                res.send({msg:'Please Login'})
            }
        }catch(err){
            res.send(err)
        }
    }else{
        res.send('Please Login!')
    }
}

module.exports = {auth}