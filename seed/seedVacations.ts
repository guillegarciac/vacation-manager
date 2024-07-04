import mongoose from 'mongoose';
import Vacation, { IVacation } from '../database/models/Vacation';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

const vacationsToSeed = [
  {
    user: new mongoose.Types.ObjectId('6686d3745afae1eb63601e11'), // ObjectId of accountManager1
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-07-10')
  },
  {
    user: new mongoose.Types.ObjectId('6686d3745afae1eb63601e12'), // ObjectId of qa1
    startDate: new Date('2024-08-01'),
    endDate: new Date('2024-08-10')
  }
];

async function seedVacations() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`Connected to the database: ${mongoose.connection.name}`);

    // Uncomment the line below if you want to clear existing vacations
    // await Vacation.deleteMany({});
    // console.log('Existing vacations cleared');

    const seededVacations = await Vacation.insertMany(vacationsToSeed as IVacation[]);
    console.log(`Seeded vacations: ${seededVacations.length}`);
  } catch (error) {
    console.error('Failed to seed vacations:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Closing connection');
  }
}

seedVacations();
