import express from 'express';
import Forecast from '../models/Forecast';

const router = express.Router();

// Get forecast for a well
router.get('/well/:wellId', async (req, res) => {
  try {
    const forecast = await Forecast.findOne({ wellId: req.params.wellId })
      .sort({ generatedAt: -1 });
    res.json(forecast);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch forecast' });
  }
});

// Create or update forecast
router.post('/', async (req, res) => {
  try {
    const forecast = new Forecast(req.body);
    await forecast.save();
    res.status(201).json(forecast);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create forecast' });
  }
});

export default router;
