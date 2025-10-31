import mongoose, { Schema, Document } from 'mongoose';

export interface IAlert extends Document {
  wellId: mongoose.Types.ObjectId;
  type: 'low_water' | 'critical' | 'failure_warning' | 'maintenance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  audioMessage?: string; // Tamil audio message URL
  isRead: boolean;
  createdAt: Date;
}

const AlertSchema: Schema = new Schema({
  wellId: { type: Schema.Types.ObjectId, ref: 'Well', required: true },
  type: {
    type: String,
    enum: ['low_water', 'critical', 'failure_warning', 'maintenance'],
    required: true,
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  message: { type: String, required: true },
  audioMessage: { type: String },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IAlert>('Alert', AlertSchema);
