import mongoose from 'mongoose';

const connect = async (): Promise<void> => {
  console.log('Connecting to MongoDB at URI:', process.env.MONGODB_URI); // Debug: What URI are we getting?

  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI as string, { 
      serverSelectionTimeoutMS: 30000, 
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    if (error instanceof Error) {
      console.error('MongoDB connection error:', error.message);
    } else {
      console.error('An unknown error occurred during MongoDB connection');
    }
  }
};

export default connect;
