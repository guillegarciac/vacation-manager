import mongoose from 'mongoose';
import Sprint, { ISprint } from '../database/models/Sprint';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

const sprintsToSeed = [
  {
    title: 'Sprint One',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-14'),
    squads: [
      new mongoose.Types.ObjectId('6686d3745afae1eb63601e11'), // Replace with actual Squad ObjectId
      new mongoose.Types.ObjectId('6686d3745afae1eb63601e12')  // Replace with actual Squad ObjectId
    ],
    account: new mongoose.Types.ObjectId('6686c60f67332635d4d68b81'), // Replace with actual Account ObjectId
    status: 'planning'
  },
  {
    title: 'Sprint Two',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-02-14'),
    squads: [
      new mongoose.Types.ObjectId('6686d3745afae1eb63601e12'), // Replace with actual Squad ObjectId
      new mongoose.Types.ObjectId('6686d3745afae1eb63601e11')  // Replace with actual Squad ObjectId
    ],
    account: new mongoose.Types.ObjectId('6686c60f67332635d4d68b82'), // Replace with actual Account ObjectId
    status: 'planning'
  }
];

async function seedSprints() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`Connected to the database: ${mongoose.connection.name}`);

    // Uncomment the line below if you want to clear existing sprints
    // await Sprint.deleteMany({});
    // console.log('Existing sprints cleared');

    const seededSprints = await Sprint.insertMany(sprintsToSeed as ISprint[]);
    console.log(`Seeded sprints: ${seededSprints.length}`);
  } catch (error) {
    console.error('Failed to seed sprints:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Closing connection');
  }
}

seedSprints();
