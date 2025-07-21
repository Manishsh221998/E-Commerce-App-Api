const express=require('express')
const dashboardController = require('../controller/dashboardController');
const AuthCheck = require('../middleware/authCheck');
const roleMiddleware = require('../middleware/roleMiddleware');
const router=express.Router()

 router.get('/dashboard', dashboardController.home);


module.exports=router