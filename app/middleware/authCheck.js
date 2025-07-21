const jwt=require('jsonwebtoken')

const AuthCheck= async (req,res,next)=>{
try {
    const token=req.headers['authorization']||req.headers['x-access-token']||req.body.token||req.params.token||req.query.token;
    if(!token){
          return res.status(400).json({
             status:false,
            message:'Token is required for authentication'
        })
    }
    const decode=jwt.verify(token,process.env.JWT_SECRET_KEY)
    // console.log("Token decode in authcheck : ",decode)

    req.user=decode
    } 
catch (error) {
        return res.status(400).json({
            status:false,
            message:"invalid token"
        })
    }
return next()
}

module.exports=AuthCheck