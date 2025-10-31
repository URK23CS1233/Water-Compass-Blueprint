import express from 'express';
import Reading from '../models/Reading';

const router = express.Router();

// Get all readings for a well
router.get('/well/:wellId', async (req, res) => {
  try {
    const readings = await Reading.find({ wellId: req.params.wellId })
      .sort({ timestamp: -1 })
      .limit(100);
    res.json(readings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch readings' });
  }
});

// Get latest reading for a well
router.get('/well/:wellId/latest', async (req, res) => {
  try {
    const reading = await Reading.findOne({ wellId: req.params.wellId })
      .sort({ timestamp: -1 });
    res.json(reading);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reading' });
  }
});

// Create new reading
router.post('/', async (req, res) => {
  try {
    const reading = new Reading(req.body);
    await reading.save();
    res.status(201).json(reading);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create reading' });
  }
});

// Get readings in date range
router.get('/well/:wellId/range', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const readings = await Reading.find({
      wellId: req.params.wellId,
      timestamp: {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      },
    }).sort({ timestamp: 1 });
    res.json(readings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch readings' });
  }
});

export default router;
