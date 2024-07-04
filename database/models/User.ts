import mongoose, { Schema, Document, Model } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
  roles: string[];
  squads: mongoose.Types.ObjectId[];
  account: mongoose.Types.ObjectId;
  suspended: boolean;
}

const UserSchema: Schema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  roles: [{ type: String, enum: ['product', 'qa', 'dev'], required: true }],
  squads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Squad' }],
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  suspended: { type: Boolean, required: true, default: false }
}, { timestamps: true });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
