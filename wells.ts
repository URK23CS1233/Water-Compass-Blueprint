import express from 'express';
import Well from '../models/Well';

const router = express.Router();

// Get all wells
router.get('/', async (req, res) => {
  try {
    const wells = await Well.find().sort({ lastUpdated: -1 });
    res.json(wells);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wells' });
  }
});

// Get well by ID
router.get('/:id', async (req, res) => {
  try {
    const well = await Well.findById(req.params.id);
    if (!well) {
      return res.status(404).json({ error: 'Well not found' });
    }
    res.json(well);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch well' });
  }
});

// Create new well
router.post('/', async (req, res) => {
  try {
    const well = new Well(req.body);
    await well.save();
    res.status(201).json(well);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create well' });
  }
});

// Update well
router.put('/:id', async (req, res) => {
  try {
    const well = await Well.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!well) {
      return res.status(404).json({ error: 'Well not found' });
    }
    res.json(well);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update well' });
  }
});

// Delete well
router.delete('/:id', async (req, res) => {
  try {
    const well = await Well.findByIdAndDelete(req.params.id);
    if (!well) {
      return res.status(404).json({ error: 'Well not found' });
    }
    res.json({ message: 'Well deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete well' });
  }
});

// Get wells near a location
router.get('/nearby/:lng/:lat', async (req, res) => {
  try {
    const { lng, lat } = req.params;
    const maxDistance = parseInt(req.query.maxDistance as string) || 10000; // 10km default

    const wells = await Well.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: maxDistance,
        },
      },
    });

    res.json(wells);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch nearby wells' });
  }
});

export default router;
