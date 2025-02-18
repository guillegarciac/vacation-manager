import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISprint extends Document {
  title: string;
  startDate: Date;
  endDate: Date;
  squads: mongoose.Types.ObjectId[];
  account: mongoose.Types.ObjectId;
  status: string;
}

const SprintSchema: Schema = new mongoose.Schema({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  squads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Squad', required: true }],
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  status: { type: String, enum: ['planning', 'active', 'completed'], default: 'planning' }
}, { timestamps: true });

const Sprint: Model<ISprint> = mongoose.models.Sprint || mongoose.model<ISprint>('Sprint', SprintSchema);

export default Sprint;
