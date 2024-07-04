import mongoose, { Schema, Document, Model } from 'mongoose';

interface IAccount extends Document {
  aid: String;
  name: string;
  productVersion: mongoose.Types.ObjectId;
  groups: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  status: string;
  suspendedBy: mongoose.Types.ObjectId | null; 
}

const AccountSchema: Schema = new mongoose.Schema({
  aid: { type: String, required: true },
  name: { type: String, required: true },
  productVersion: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductVersion', required: true },
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: 'ACTIVE' },
  suspendedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null } 
}, { timestamps: true });

const Account: Model<IAccount> = mongoose.models.Account || mongoose.model<IAccount>('Account', AccountSchema);

export default Account;
