import mongoose, { Schema, Document } from 'mongoose';

export interface IWell extends Document {
  name: string;
  location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  address: string;
  depth: number; // in feet
  currentWaterLevel: number; // in feet
  status: 'safe' | 'moderate' | 'low' | 'critical';
  owner: string;
  lastUpdated: Date;
  createdAt: Date;
}

const WellSchema: Schema = new Schema({
  name: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
  address: { type: String, required: true },
  depth: { type: Number, required: true },
  currentWaterLevel: { type: Number, required: true },
  status: {
    type: String,
    enum: ['safe', 'moderate', 'low', 'critical'],
    default: 'safe',
  },
  owner: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

WellSchema.index({ location: '2dsphere' });

export default mongoose.model<IWell>('Well', WellSchema);
