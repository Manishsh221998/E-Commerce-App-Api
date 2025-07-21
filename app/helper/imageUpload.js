const multer=require('multer')
const path=require('path')
const fs=require('fs')

const FILE_TYPE_MAP={
    'image/png':'png',
    'image/jpg':'jpg',
    'image/jpeg':'jpeg',
    'image/avif':'avif',
}
const storage=multer.diskStorage({
    destination:function (req,file,cb){
        const isValid=FILE_TYPE_MAP[file.mimetype]
        let upload=new Error("Inalid image type")
        if(isValid){
            upload=null
        }
        cb(upload,'uploads/userImages')
    },
    filename:function (req,file,cb) {
        const fileName=file.originalname.split(' ').join('-')
        const extension=FILE_TYPE_MAP[file.mimetype]
        cb(null,`${fileName}-${Date.now()}.${extension}`)
    }
})

const profileImage=multer({storage:storage})
module.exports=profileImage