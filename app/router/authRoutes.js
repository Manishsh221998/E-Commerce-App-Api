const express=require('express')
const authController = require('../controller/authController');
const AuthCheck = require('../middleware/authCheck');
const profileImage = require('../helper/imageUpload');
const roleMiddleware = require('../middleware/roleMiddleware');
const router=express.Router()

router.post("/role", authController.createRole);
router.get("/roles", authController.getAllRoles);

router.post('/create/super-admin', authController.createSuperAdmin);


module.exports=router