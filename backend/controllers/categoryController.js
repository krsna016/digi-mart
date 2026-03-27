const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a category group
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res) => {
  try {
    const { gender, group, items } = req.body;
    const trimmedItems = items ? items.map(i => i.trim()).filter(i => i !== '') : [];
    const category = new Category({ 
      gender: gender.toLowerCase(), 
      group: group.trim(), 
      items: trimmedItems 
    });
    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a category group
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res) => {
  try {
    const { gender, group, items } = req.body;
    const category = await Category.findById(req.params.id);

    if (category) {
      const trimmedItems = items ? items.map(i => i.trim()).filter(i => i !== '') : category.items;
      category.gender = gender ? gender.toLowerCase() : category.gender;
      category.group = group ? group.trim() : category.group;
      category.items = trimmedItems;

      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a category group
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      await category.deleteOne();
      res.json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Seed default categories
// @route   POST /api/categories/seed
// @access  Private/Admin
exports.seedCategories = async (req, res) => {
  const defaultCategories = [
    { gender: 'women', group: 'Dresses', items: ['Midi Dresses', 'Maxi Dresses', 'Evening Gowns', 'Cocktail Dresses'] },
    { gender: 'women', group: 'Tops', items: ['Blouses & Shirts', 'Knitwear', 'T-Shirts', 'Tanks'] },
    { gender: 'women', group: 'Bottoms', items: ['Jeans', 'Skirts', 'Trousers', 'Shorts'] },
    { gender: 'women', group: 'Outerwear', items: ['Coats', 'Jackets', 'Cardigans', 'Blazers'] },
    { gender: 'men', group: 'Tops', items: ['Casual Shirts', 'T-Shirts', 'Hoodies & Sweatshirts', 'Polo Shirts'] },
    { gender: 'men', group: 'Bottoms', items: ['Chinos', 'Jeans', 'Shorts', 'Trousers'] },
    { gender: 'men', group: 'Outerwear', items: ['Blazers', 'Jackets', 'Coats', 'Overshirts'] },
    { gender: 'kids', group: 'Essentials', items: ['T-Shirts', 'Bodysuits', 'Leggings', 'Pyjamas'] },
    { gender: 'kids', group: 'Outfits', items: ['Dresses', 'Sets', 'Outerwear', 'Swimwear'] }
  ];

  try {
    // Only seed if empty, or can be used to re-sync
    const count = await Category.countDocuments();
    if (count > 0 && !req.query.force) {
      return res.status(400).json({ message: 'Categories already exist. Use ?force=true to overwrite.' });
    }

    if (req.query.force) {
      await Category.deleteMany();
    }

    const created = await Category.insertMany(defaultCategories);
    res.status(201).json({ message: 'Categories seeded successfully', count: created.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
