import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  roles: string[];
  account: mongoose.Types.ObjectId;
  suspended: boolean;
}

const UserSchema: Schema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: [{ type: String, enum: ['admin', 'product', 'qa', 'dev'], required: true }],
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  suspended: { type: Boolean, required: true, default: false }
}, { timestamps: true });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
