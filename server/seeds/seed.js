const Roadmap = require('../src/models/Roadmap');
const Module = require('../src/models/Module');
const Topic = require('../src/models/Topic');
const { dsaRoadmap, dbmsRoadmap } = require('./seedData');

/**
 * Idempotently seed or update a roadmap, its modules, and its topics.
 * Preserves existing database records, references, and user progress.
 */
async function seedRoadmap(roadmapData) {
  const { modules, ...roadmapFields } = roadmapData;

  // 1. Find or create the roadmap document
  let roadmap = await Roadmap.findOne({ slug: roadmapFields.slug });
  if (!roadmap) {
    roadmap = await Roadmap.create({
      ...roadmapFields,
      status: roadmapFields.status || 'published',
    });
    console.log(`[Seed] Created roadmap: "${roadmap.title}" (slug: ${roadmap.slug})`);
  } else {
    Object.assign(roadmap, roadmapFields);
    await roadmap.save();
    console.log(`[Seed] Updated roadmap metadata: "${roadmap.title}" (slug: ${roadmap.slug})`);
  }

  // 2. Iterate through modules and sync ordered topics
  for (const modData of modules) {
    const { topics, ...modFields } = modData;

    let moduleDoc = await Module.findOne({
      roadmapId: roadmap._id,
      title: modFields.title,
    });

    if (!moduleDoc) {
      moduleDoc = await Module.create({
        ...modFields,
        roadmapId: roadmap._id,
        status: modFields.status || 'published',
      });
      console.log(`  [Module] Created: "${moduleDoc.title}"`);
    } else {
      Object.assign(moduleDoc, modFields);
      await moduleDoc.save();
    }

    // 3. Sync topics within module using stable key
    for (const topicData of topics) {
      let topicDoc = await Topic.findOne({
        roadmapId: roadmap._id,
        key: topicData.key,
      });

      if (!topicDoc) {
        topicDoc = await Topic.create({
          ...topicData,
          roadmapId: roadmap._id,
          moduleId: moduleDoc._id,
          status: topicData.status || 'published',
        });
        console.log(`    [Topic] Created: "${topicDoc.title}" [${topicDoc.key}]`);
      } else {
        // Update topic content while keeping existing references intact
        Object.assign(topicDoc, topicData, { moduleId: moduleDoc._id });
        await topicDoc.save();
      }
    }
  }
}

/**
 * Main seed execution function.
 */
async function seedDatabase() {
  console.log('[Seed] Starting idempotent curriculum seed...');
  
  console.log('[Seed] Seeding Data Structures & Algorithms Roadmap...');
  await seedRoadmap(dsaRoadmap);

  console.log('[Seed] Seeding Database Management Systems Roadmap...');
  await seedRoadmap(dbmsRoadmap);

  console.log('[Seed] Curriculum seed completed successfully.');
}

module.exports = { seedDatabase, seedRoadmap };
