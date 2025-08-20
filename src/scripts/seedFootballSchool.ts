// scripts/seedFootballSchool.ts

// ⛳️ VERY IMPORTANT: load .env.local BEFORE anything else
import { config } from 'dotenv';
config({ path: '.env.local' });

import { getCollection } from '@/lib/mongodb'; // now it's safe

async function seedFootballSchool() {
  const footballSchoolCollection = await getCollection('footballschools');

  if (!footballSchoolCollection) {
    console.error('⚠️ Collection not found. Check your database connection.');
    return;
  }

  await footballSchoolCollection.deleteMany({});

  const seedData = [
    {
      name: 'Coach Mark Johnson',
      img: '',
      content: 'Mark has been with the club for 10 years and leads the U15 team.',
    },
    {
      name: 'Coach Ana Rivera',
      img: '',
      content: 'Ana brings her European training methods to our U12 squad.',
    },
    {
      name: 'Coach Liam Chen',
      img: '',
      content: 'Liam specializes in goalkeeper development and tactics.',
    },
  ];

  await footballSchoolCollection.insertMany(seedData);
  process.exit();
}

seedFootballSchool().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
