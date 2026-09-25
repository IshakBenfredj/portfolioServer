const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Category = require('../models/category');
const { defaultCategories } = require('../controllers/category-controller');

async function runSeed() {
  const mongoUri = process.env.MONGODB_URL || process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('❌ MONGODB_URL is missing in .env file!');
    process.exit(1);
  }

  console.log('🔄 Connecting to MongoDB...');
  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB.');

  console.log(`🚀 Seeding dynamic categories (${defaultCategories.length} categories total across skills, products, lessons, portfolio)...`);

  // Remove obsolete skills categories not present in defaultCategories
  const validSkillKeys = defaultCategories.filter(c => c.type === 'skills').map(c => c.key);
  await Category.deleteMany({ type: 'skills', key: { $nin: validSkillKeys } });

  let createdCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;

  for (const item of defaultCategories) {
    const existing = await Category.findOne({ type: item.type, key: item.key });
    if (!existing) {
      await Category.create(item);
      console.log(`  ➕ [${item.type.toUpperCase()}] Created: "${item.name}" / "${item.nameAr}" (key: "${item.key}")`);
      createdCount++;
    } else {
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
        console.log(`  🔄 [${item.type.toUpperCase()}] Updated: "${item.key}"`);
        updatedCount++;
      } else {
        console.log(`  ✔️ [${item.type.toUpperCase()}] Already exists: "${item.key}"`);
        skippedCount++;
      }
    }
  }

  console.log('\n=======================================');
  console.log(`🎉 Seeding finished!`);
  console.log(`   ➕ Created: ${createdCount}`);
  console.log(`   🔄 Updated: ${updatedCount}`);
  console.log(`   ✔️ Kept/Skipped: ${skippedCount}`);
  console.log('=======================================\n');

  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB.');
  process.exit(0);
}

runSeed().catch((err) => {
  console.error('❌ Seeding failed with error:', err);
  process.exit(1);
});
