const express=require('express')
const categoryController = require('../controller/categoryController');
const AuthCheck = require('../middleware/authCheck');
 const roleMiddleware = require('../middleware/roleMiddleware');
const router=express.Router()

// Categories/Subcategories (All Roles)

//Categories routes

router.use(AuthCheck,roleMiddleware(['Super Admin','Admin','User']))

router.post('/create/category', categoryController.createCategory);
router.get('/categories', categoryController.listCategories);
router.put('/category/edit/:id', categoryController.editCategory);
router.delete('/category/delete/:id', categoryController.deleteCategory);

// Subcategory routes (Super Admin & Admin)
router.use(AuthCheck,roleMiddleware(['Super Admin','Admin']))

 router.post('/category/:id/subcategory', categoryController.addSubcategory);
router.put('/update/category/:id/subcategory',categoryController.updateSubcategory);
router.delete('/delete/category/:id/subcategory',categoryController.deleteSubcategory);

module.exports=router