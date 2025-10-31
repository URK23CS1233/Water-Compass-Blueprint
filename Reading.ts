import mongoose, { Schema, Document } from 'mongoose';

export interface IReading extends Document {
  wellId: mongoose.Types.ObjectId;
  waterLevel: number; // in feet
  rainfall: number; // in mm
  soilMoisture: number; // percentage
  temperature: number; // in Celsius
  timestamp: Date;
  notes?: string;
}

const ReadingSchema: Schema = new Schema({
  wellId: { type: Schema.Types.ObjectId, ref: 'Well', required: true },
  waterLevel: { type: Number, required: true },
  rainfall: { type: Number, default: 0 },
  soilMoisture: { type: Number, default: 0 },
  temperature: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
  notes: { type: String },
});

export default mongoose.model<IReading>('Reading', ReadingSchema);
