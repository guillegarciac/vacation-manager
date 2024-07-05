import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVacation extends Document {
  user: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
}

const VacationSchema: Schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
}, { timestamps: true });

const Vacation: Model<IVacation> = mongoose.models.Vacation || mongoose.model<IVacation>('Vacation', VacationSchema);

export default Vacation;
