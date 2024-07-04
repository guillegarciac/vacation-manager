import mongoose from 'mongoose';
import User, { IUser } from '../database/models/User';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

const usersToSeed = [
  {
    username: 'accountManager1',
    email: 'am1@am.am',
    account: new mongoose.Types.ObjectId('6686c60f67332635d4d68b81'),
    roles: ['product'],
    password: 'testtest',
    suspended: false
  },
  {
    username: 'qa1',
    email: 'em1@em.em',
    account: new mongoose.Types.ObjectId('6686c60f67332635d4d68b82'),
    roles: ['qa'],
    password: 'testtest',
    suspended: false
  }
];

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`Connected to the database: ${mongoose.connection.name}`);

    await User.deleteMany({});
    console.log('Existing users cleared');

    // Hash passwords and add them to the user objects
    for (const user of usersToSeed) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    const seededUsers = await User.insertMany(usersToSeed as IUser[]);
    console.log(`Seeded users: ${seededUsers.length}`);
  } catch (error) {
    console.error('Failed to seed users:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Closing connection');
  }
}

seedUsers();
