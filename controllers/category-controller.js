const Category = require('../models/category');

const defaultCategories = [
  // 1. Skills Categories
  {
    type: 'skills',
    key: 'software',
    name: 'Software & Web Development',
    nameAr: 'هندسة البرمجيات والويب',
    nameFr: 'Ingénierie Logicielle & Web',
    icon: '💻',
    order: 1,
  },
  {
    type: 'skills',
    key: 'is',
    name: 'Information Systems & Modeling (SIW)',
    nameAr: 'أنظمة المعلومات والنمذجة (SIW)',
    nameFr: 'Systèmes d\'Information & Modélisation (SIW)',
    icon: '📐',
    order: 2,
  },
  {
    type: 'skills',
    key: 'office',
    name: 'Office & Productivity (Office)',
    nameAr: 'الأدوات المكتبية والإنتاجية (Office)',
    nameFr: 'Bureautique & Productivité (Office)',
    icon: '📑',
    order: 3,
  },
  {
    type: 'skills',
    key: 'tools',
    name: 'DevOps & Tools',
    nameAr: 'أدوات التطوير و DevOps',
    nameFr: 'Outils & DevOps',
    icon: '🚀',
    order: 4,
  },

  // 2. Products Categories
  {
    type: 'products',
    key: 'templates',
    name: 'Web Templates (MERN / Next.js)',
    nameAr: 'قوالب الويب (MERN / Next.js)',
    nameFr: 'Templates Web',
    icon: '🌐',
    order: 1,
  },
  {
    type: 'products',
    key: 'mobile',
    name: 'Mobile Apps (React Native)',
    nameAr: 'تطبيقات الهواتف الذكية',
    nameFr: 'Applications Mobiles',
    icon: '📱',
    order: 2,
  },
  {
    type: 'products',
    key: 'docs',
    name: 'Documentation & SIW (Cahier des Charges)',
    nameAr: 'نماذج التوثيق و SIW (دفاتر الشروط)',
    nameFr: 'Modèles & Cahier des Charges',
    icon: '📄',
    order: 3,
  },
  {
    type: 'products',
    key: 'bi',
    name: 'Power BI Dashboards',
    nameAr: 'لوحات ذكاء الأعمال (Power BI)',
    nameFr: 'Tableaux de Bord Power BI',
    icon: '📊',
    order: 4,
  },
  {
    type: 'products',
    key: 'other',
    name: 'Other Digital Assets',
    nameAr: 'منتجات وأصول رقمية أخرى',
    nameFr: 'Autres Ressources',
    icon: '📦',
    order: 5,
  },

  // 3. Lessons / Blog Categories
  {
    type: 'lessons',
    key: 'Architecture & SIW',
    name: 'Architecture & SIW',
    nameAr: 'المعمارية ونظم المعلومات',
    nameFr: 'Architecture & SIW',
    icon: '🏗️',
    order: 1,
  },
  {
    type: 'lessons',
    key: 'Full-Stack Web',
    name: 'Full-Stack Web',
    nameAr: 'تطوير الويب الكامل',
    nameFr: 'Développement Full-Stack',
    icon: '💻',
    order: 2,
  },
  {
    type: 'lessons',
    key: 'Mobile Apps',
    name: 'Mobile Applications',
    nameAr: 'تطبيقات الهواتف الذكية',
    nameFr: 'Applications Mobiles',
    icon: '📱',
    order: 3,
  },
  {
    type: 'lessons',
    key: 'PFE & Startups',
    name: 'PFE & Startups',
    nameAr: 'مشاريع التخرج والشركات الناشئة',
    nameFr: 'PFE & Startups',
    icon: '🎓',
    order: 4,
  },
  {
    type: 'lessons',
    key: 'DevOps & Cloud',
    name: 'DevOps & Cloud',
    nameAr: 'السحابة والأمان و DevOps',
    nameFr: 'DevOps & Cloud',
    icon: '☁️',
    order: 5,
  },

  // 4. Portfolio / Projects Categories
  {
    type: 'portfolio',
    key: 'web',
    name: 'Web Applications',
    nameAr: 'تطبيقات ومواقع الويب',
    nameFr: 'Applications Web',
    icon: '🌐',
    order: 1,
  },
  {
    type: 'portfolio',
    key: 'mobile',
    name: 'Mobile Applications',
    nameAr: 'تطبيقات الهواتف الذكية',
    nameFr: 'Applications Mobiles',
    icon: '📱',
    order: 2,
  },
  {
    type: 'portfolio',
    key: 'desktop',
    name: 'Desktop Applications',
    nameAr: 'برمجيات سطح المكتب',
    nameFr: 'Applications Bureau',
    icon: '🖥️',
    order: 3,
  },
  {
    type: 'portfolio',
    key: 'siw',
    name: 'Information Systems & Modeling',
    nameAr: 'نظم المعلومات ونمذجة العمليات',
    nameFr: 'Systèmes d\'Information & Modélisation',
    icon: '📑',
    order: 4,
  },
];

// Get all categories or filter by ?type=
const getAllCategories = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const categories = await Category.find(filter).sort({ order: 1, createdAt: 1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error('getAllCategories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Get categories by specific type (skills, products, lessons, portfolio)
const getCategoriesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const categories = await Category.find({ type, isActive: { $ne: false } }).sort({ order: 1, createdAt: 1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error('getCategoriesByType error:', error);
    res.status(500).json({ error: 'Failed to fetch categories for type' });
  }
};

// Add new category
const addCategory = async (req, res) => {
  try {
    const { type, key, name, nameAr, nameFr, icon, color, order } = req.body;

    if (!type || !name) {
      return res.status(400).json({ error: 'Type and Name are required' });
    }

    const generatedKey = (key || name).trim();

    // Check if key already exists in this type
    const existing = await Category.findOne({ type, key: generatedKey });
    if (existing) {
      return res.status(400).json({ error: `Category with key "${generatedKey}" already exists in ${type}` });
    }

    const category = await Category.create({
      type,
      key: generatedKey,
      name: name.trim(),
      nameAr: nameAr ? nameAr.trim() : name.trim(),
      nameFr: nameFr ? nameFr.trim() : '',
      icon: icon || '',
      color: color || '',
      order: Number(order) || 0,
      isActive: true,
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('addCategory error:', error);
    res.status(500).json({ error: error.message || 'Failed to add category' });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { key, name, nameAr, nameFr, icon, color, order, isActive } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    if (key && key !== category.key) {
      const duplicate = await Category.findOne({ type: category.type, key, _id: { $ne: id } });
      if (duplicate) {
        return res.status(400).json({ error: `Key "${key}" is already in use for ${category.type}` });
      }
      category.key = key.trim();
    }

    if (name) category.name = name.trim();
    if (nameAr !== undefined) category.nameAr = nameAr.trim();
    if (nameFr !== undefined) category.nameFr = nameFr.trim();
    if (icon !== undefined) category.icon = icon;
    if (color !== undefined) category.color = color;
    if (order !== undefined) category.order = Number(order);
    if (isActive !== undefined) category.isActive = Boolean(isActive);

    await category.save();
    res.status(200).json(category);
  } catch (error) {
    console.error('updateCategory error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully', id });
  } catch (error) {
    console.error('deleteCategory error:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};

// Seed default categories into database
const seedCategories = async (req, res) => {
  try {
    const results = [];
    for (const item of defaultCategories) {
      const existing = await Category.findOne({ type: item.type, key: item.key });
      if (!existing) {
        const created = await Category.create(item);
        results.push({ action: 'created', key: item.key, type: item.type });
      } else {
        // Update names if empty
        let changed = false;
        if (!existing.nameAr && item.nameAr) {
          existing.nameAr = item.nameAr;
          changed = true;
        }
        if (!existing.nameFr && item.nameFr) {
          existing.nameFr = item.nameFr;
          changed = true;
        }
        if (!existing.icon && item.icon) {
          existing.icon = item.icon;
          changed = true;
        }
        if (changed) {
          await existing.save();
          results.push({ action: 'updated', key: item.key, type: item.type });
        } else {
          results.push({ action: 'skipped', key: item.key, type: item.type });
        }
      }
    }

    const all = await Category.find().sort({ type: 1, order: 1 });
    res.status(200).json({
      message: 'Default categories seeded successfully',
      stats: results,
      total: all.length,
      categories: all,
    });
  } catch (error) {
    console.error('seedCategories error:', error);
    res.status(500).json({ error: error.message || 'Failed to seed categories' });
  }
};

module.exports = {
  getAllCategories,
  getCategoriesByType,
  addCategory,
  updateCategory,
  deleteCategory,
  seedCategories,
  defaultCategories,
};
