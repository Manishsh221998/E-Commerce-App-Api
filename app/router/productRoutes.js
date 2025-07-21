const express=require('express')
const router=express.Router()
 const AuthCheck = require('../middleware/authCheck');
 const roleMiddleware = require('../middleware/roleMiddleware');
 const productController = require('../controller/productController');

 // product (Super Admin & User)
router.use(AuthCheck,roleMiddleware(['Super Admin','User']))

router.get('/product',productController.listProducts);
router.post('/create/product',productController.createProduct);
router.put('/product/edit/:id',productController.editProduct);
router.delete('/product/delete/:id',productController.deleteProduct);


module.exports=router