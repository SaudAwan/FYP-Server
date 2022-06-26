module.exports=(req,res,next)=>{
    const jwt=require('jsonwebtoken')
    const {authorization}=req.headers
    if(authorization){
        token=authorization.substring(7, authorization.length)
        jwt.verify(token,process.env.secretKey,(e,verified)=>{
            if(verified){
                next()
            } else{
                res.send({message:'Token expired'})
            }
        })
    } else{
        res.send({message:'Token expired'})
    }
}