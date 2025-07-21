const Product = require('../model/Product');
const CategorySubcategory = require('../model/CategorySubcategory');

class ProductController {
  // List all products with category details
  async listProducts(req, res) {
    try {
      const products = await Product.aggregate([
        {
          $lookup: {
            from: 'categorysubcategories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'category'
          }
        },
        {
          $unwind: '$category'
        },
        {
          $project: {
            name: 1,
            price: 1,
            subcategoryName: 1,
            categoryName: '$category.categoryName'
          }
        }
      ]);
      res.status(200).json({ success: true,totalCount:products.length,data: products });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch products', error: error.message });
    }
  }

  // Create a new product
  async createProduct(req, res) {
    try {
      const { name, price, categoryId, subcategoryName } = req.body;
      const product = await Product.create({ name, price, categoryId, subcategoryName });
      res.status(201).json({ success: true, message: 'Product created successfully', data: product });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Failed to create product', error: error.message });
    }
  }

  // Edit an existing product
  async editProduct(req, res) {
    try {
      const { name, price, categoryId, subcategoryName } = req.body;
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { name, price, categoryId, subcategoryName },
        { new: true }
      );

      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      res.status(200).json({ success: true, message: 'Product updated successfully', data: product });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Failed to update product', error: error.message });
    }
  }

  // Delete a product
  async deleteProduct(req, res) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);

      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete product', error: error.message });
    }
  }
}

module.exports = new ProductController();
