import mongoose from 'mongoose';
import Account from '../database/models/Account'; // Make sure the path is correct
require('dotenv').config({ path: './.env.local' });

// Array of accounts to seed
const accountsToSeed = [
    { aid: '001', name: 'Account One', createdBy: new mongoose.Types.ObjectId(), status: 'ACTIVE' },
    { aid: '002', name: 'Account Two', createdBy: new mongoose.Types.ObjectId(), status: 'ACTIVE' },
    // Add more accounts as needed
];

async function clearAndSeedAccounts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('MongoDB connected successfully');

        // Delete existing accounts
        await Account.deleteMany({});
        console.log('Existing accounts cleared');

        // Insert new accounts
        await Account.insertMany(accountsToSeed);
        console.log('New accounts seeded');
    } catch (error) {
        console.error('Failed to seed accounts:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

clearAndSeedAccounts();