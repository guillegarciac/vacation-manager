import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAccount extends Document {
  aid: string;
  name: string;
  createdBy: mongoose.Types.ObjectId;
  status: string;
}

const AccountSchema: Schema = new mongoose.Schema({
  aid: { type: String, required: true },
  name: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: 'ACTIVE' },
}, { timestamps: true });

const Account: Model<IAccount> = mongoose.models.Account || mongoose.model<IAccount>('Account', AccountSchema);

export default Account;
