const bcrypt=require('bcryptjs')

const comparePassword=async(password,hashedPaswword)=>{
return await bcrypt.compare(password,hashedPaswword)
}

module.exports=comparePassword