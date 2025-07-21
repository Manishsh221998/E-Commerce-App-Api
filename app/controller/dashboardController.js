const Product = require('../model/Product');
const CategorySubcategory = require('../model/CategorySubcategory');

class DashboardController {
  async home(req, res) {
    try {
      // Total counts
      const totalProducts = await Product.countDocuments();
      const totalCategories = await CategorySubcategory.countDocuments();

      // Aggregate category stats with per-category subcategory count
      const categoryStats = await CategorySubcategory.aggregate([
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: 'categoryId',
            as: 'products'
          }
        },
        {
          $project: {
            categoryName: 1,
            totalProducts: { $size: '$products' },
            totalSubcategories: { $size: '$subcategories' },
            subcategories: 1
          }
        }
      ]);

      // Calculate total subcategories count across all categories
      // Fetch all categories' subcategories arrays and sum lengths
      const allCategories = await CategorySubcategory.find({}, { subcategories: 1 });
      const totalSubcategoriesCount = allCategories.reduce((acc, cat) => {
        return acc + (cat.subcategories ? cat.subcategories.length : 0);
      }, 0);

      res.status(200).json({
        success: true,
        message: 'Dashboard data loaded successfully',
        data: {
          totalProducts,
          totalCategories,
          totalSubcategoriesCount, // total subcategories across all categories
          categoryStats
        }
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to load dashboard data',
        error: error.message
      });
    }
  }
}

module.exports = new DashboardController();
