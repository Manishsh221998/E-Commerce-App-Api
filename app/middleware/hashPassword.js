const bcrypt=require('bcryptjs')

 const hashPassword=async (password)=>{
  const salt=await bcrypt.genSalt(10)
 const passwordHased=await bcrypt.hash(password,salt)
 return passwordHased
}

module.exports=hashPassword