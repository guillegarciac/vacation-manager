import mongoose, { Schema, Document, Model } from 'mongoose';

interface ISquad extends Document {
  name: string;
  members: mongoose.Types.ObjectId[];
  account: mongoose.Types.ObjectId;
}

const SquadSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true }
}, { timestamps: true });

const Squad: Model<ISquad> = mongoose.models.Squad || mongoose.model<ISquad>('Squad', SquadSchema);

export default Squad;
