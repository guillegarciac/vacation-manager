import mongoose from 'mongoose';
import Squad, { ISquad } from '../database/models/Squad';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

const squadsToSeed = [
  {
    name: 'Squad Alpha',
    members: [
      new mongoose.Types.ObjectId('6686d3745afae1eb63601e11'), // ObjectId of accountManager1
      new mongoose.Types.ObjectId('6686d3745afae1eb63601e12')  // ObjectId of qa1
    ],
    account: new mongoose.Types.ObjectId('6686c60f67332635d4d68b81') // ObjectId of account for accountManager1
  },
  {
    name: 'Squad Beta',
    members: [
      new mongoose.Types.ObjectId('6686d3745afae1eb63601e12'), // ObjectId of qa1
      new mongoose.Types.ObjectId('6686d3745afae1eb63601e11')  // ObjectId of accountManager1
    ],
    account: new mongoose.Types.ObjectId('6686c60f67332635d4d68b82') // ObjectId of account for qa1
  }
];

async function seedSquads() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`Connected to the database: ${mongoose.connection.name}`);

    // Uncomment the line below if you want to clear existing squads
    await Squad.deleteMany({});
    console.log('Existing squads cleared');

    const seededSquads = await Squad.insertMany(squadsToSeed as ISquad[]);
    console.log(`Seeded squads: ${seededSquads.length}`);
  } catch (error) {
    console.error('Failed to seed squads:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Closing connection');
  }
}

seedSquads();
