const express=require('express')
const userController = require('../controller/userController');
const AuthCheck = require('../middleware/authCheck');
const roleMiddleware = require('../middleware/roleMiddleware');
const router=express.Router()

// Users (Super Admin & Admin)
router.post('/create/users',AuthCheck,roleMiddleware(['Super Admin']), userController.createUser);
router.get('/users',AuthCheck,roleMiddleware(['Super Admin','Admin']), userController.listUsers);

router.post("/login", userController.login);
router.post('/user/status/:id',AuthCheck,roleMiddleware(['Super Admin','Admin']), userController.toggleUserStatus);
router.put('/user/update/:id',AuthCheck,roleMiddleware(['Super Admin','Admin']),userController.updateUser);
router.post('/user/delete/:id',AuthCheck,roleMiddleware(['Super Admin','Admin']), userController.deleteUser);
 


module.exports=router