const CategorySubcategory = require('../model/CategorySubcategory');

class CategoryController {
  // List all categories
  async listCategories(req, res) {
    try {
      const categories = await CategorySubcategory.find();
      res.status(200).json({
        message: "Categories fetched successfully",
        totalCount: categories.length,
        data: categories
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  }

  // Create a new category (with optional subcategories)
async createCategory(req, res) {
  try {
    const { categoryName, subcategories = [] } = req.body;

    if (!categoryName) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const newCategory = await CategorySubcategory.create({ categoryName, subcategories });

    res.status(201).json({
      message: "Category created successfully",
      data: newCategory
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Failed to create category" });
  }
}

  // Edit category
  async editCategory(req, res) {
    try {
      const { categoryName, subcategories } = req.body;

      const updatedCategory = await CategorySubcategory.findByIdAndUpdate(
        req.params.id,
        { categoryName, subcategories },
        { new: true }
      );

      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.status(200).json({
        message: "Category updated successfully",
        data: updatedCategory
      });
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Failed to update category" });
    }
  }

  // Delete category
  async deleteCategory(req, res) {
    try {
      const deletedCategory = await CategorySubcategory.findByIdAndDelete(req.params.id);

      if (!deletedCategory) {
        return res.status(404).json({ message: "Category not found or already deleted" });
      }

      res.status(200).json({
        message: "Category deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  }

  
// -------------------- SUB-CATEGORY --------------------------

  // Add a subcategory to an existing category
async addSubcategory(req, res) {
  try {
    const { id } = req.params;
    const { subcategories } = req.body;

    if (!Array.isArray(subcategories) || subcategories.length === 0) {
      return res.status(400).json({ message: "subcategories must be a non-empty array" });
    }

    const category = await CategorySubcategory.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Push each new subcategory object into the existing subcategories array
    subcategories.forEach(sub => {
      if (sub.name) {
        category.subcategories.push({ name: sub.name });
      }
    });

    await category.save();

    res.status(200).json({
      message: "Subcategories added successfully",
      data: category
    });
  } catch (error) {
    console.error("Error adding subcategories:", error);
    res.status(500).json({ message: "Failed to add subcategories" });
  }
}

// Update a subcategory by subcategory _id
async updateSubcategory(req, res) {
  try {
    const { id } = req.params; // category ID
    const { subcategoryId, newName } = req.body;

    if (!subcategoryId || !newName) {
      return res.status(400).json({ message: "subcategoryId and newName are required" });
    }

    const category = await CategorySubcategory.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subcategory = category.subcategories._id(subcategoryId);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    subcategory.name = newName;
    await category.save();

    res.status(200).json({
      message: "Subcategory updated successfully",
      data: category
    });
  } catch (error) {
    console.error("Error updating subcategory:", error);
    res.status(500).json({ message: "Failed to update subcategory" });
  }
}

// Delete a subcategory by name or _id
async deleteSubcategory(req, res) {
  try {
    const { id } = req.params; // category ID
    const { subcategoryId } = req.body; // ID of the subcategory to delete

    if (!subcategoryId) {
      return res.status(400).json({ message: "subcategoryId is required" });
    }

    const updatedCategory = await CategorySubcategory.findByIdAndUpdate(
      id,
      { $pull: { subcategories: { _id: subcategoryId } } },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category or Subcategory not found" });
    }

    res.status(200).json({
      message: "Subcategory deleted successfully",
      data: updatedCategory
    });
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    res.status(500).json({ message: "Failed to delete subcategory" });
  }
}

}

module.exports = new CategoryController();
