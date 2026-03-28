const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc    Sync categories from products
// @route   POST /api/categories/sync
// @access  Private/Admin
exports.syncFromProducts = async (req, res) => {
  try {
    const products = await Product.find({}, 'gender category');
    const existingCats = await Category.find({});
    
    // Create a map of existing normalized names
    const existingMap = new Set();
    existingCats.forEach(c => {
      existingMap.add(`${c.gender.toLowerCase()}:::${c.group.toLowerCase().trim()}`);
      if (c.items) {
        c.items.forEach(item => existingMap.add(`${c.gender.toLowerCase()}:::${item.toLowerCase().trim()}`));
      }
    });

    let addedCount = 0;
    for (const p of products) {
      if (!p.gender || !p.category) continue;
      
      const gender = p.gender.toLowerCase();
      const catNameRaw = p.category.toLowerCase().trim();
      const key = `${gender}:::${catNameRaw}`;
      
      if (!existingMap.has(key)) {
        const displayGroup = catNameRaw.charAt(0).toUpperCase() + catNameRaw.slice(1);
        const newCat = new Category({
          gender,
          group: displayGroup,
          items: [displayGroup]
        });
        await newCat.save();
        addedCount++;
        existingMap.add(key);
      }
    }

    res.json({ message: 'Sync complete', addedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
    { gender: 'women', group: 'Ethnic Wear', items: ['Sarees', 'Kurtas & Kurtis', 'Lehengas', 'Salwar Suits', 'Ethnic Dresses'] },
    { gender: 'women', group: 'Western Wear', items: ['Tops & Shirts', 'Dresses', 'Jeans', 'Trousers'] },
    { gender: 'women', group: 'Accessories', items: ['Jewellery', 'Handbags', 'Footwear'] },
    { gender: 'men', group: 'Ethnic Wear', items: ['Kurtas', 'Sherwanis', 'Nehru Jackets', 'Dhotis & Pyjamas'] },
    { gender: 'men', group: 'Casual Wear', items: ['Shirts', 'T-Shirts', 'Jeans', 'Trousers'] },
    { gender: 'men', group: 'Footwear', items: ['Mojaris', 'Formal Shoes', 'Casual Shoes'] },
    { gender: 'kids', group: 'Girls Ethnic', items: ['Lehenga Choli', 'Anarkali Suits', 'Pattu Pavadai'] },
    { gender: 'kids', group: 'Boys Ethnic', items: ['Dhoti Kurta Set', 'Kurta Pyjama', 'Sherwanis'] },
    { gender: 'kids', group: 'Daily Wear', items: ['T-Shirts', 'Dresses', 'Sets'] }
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
