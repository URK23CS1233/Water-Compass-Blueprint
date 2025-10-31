import mongoose, { Schema, Document } from 'mongoose';

export interface IForecast extends Document {
  wellId: mongoose.Types.ObjectId;
  predictions: Array<{
    date: Date;
    predictedLevel: number;
    confidence: number;
  }>;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  generatedAt: Date;
}

const ForecastSchema: Schema = new Schema({
  wellId: { type: Schema.Types.ObjectId, ref: 'Well', required: true },
  predictions: [
    {
      date: { type: Date, required: true },
      predictedLevel: { type: Number, required: true },
      confidence: { type: Number, required: true },
    },
  ],
  riskLevel: {
    type: String,
    enum: ['low', 'moderate', 'high', 'critical'],
    default: 'moderate',
  },
  generatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IForecast>('Forecast', ForecastSchema);
