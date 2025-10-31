import express from 'express';
import Alert from '../models/Alert';

const router = express.Router();

// Get all alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find()
      .populate('wellId')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Get unread alerts
router.get('/unread', async (req, res) => {
  try {
    const alerts = await Alert.find({ isRead: false })
      .populate('wellId')
      .sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch unread alerts' });
  }
});

// Get alerts for a specific well
router.get('/well/:wellId', async (req, res) => {
  try {
    const alerts = await Alert.find({ wellId: req.params.wellId })
      .sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Create new alert
router.post('/', async (req, res) => {
  try {
    const alert = new Alert(req.body);
    await alert.save();
    res.status(201).json(alert);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create alert' });
  }
});

// Mark alert as read
router.put('/:id/read', async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    res.json(alert);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update alert' });
  }
});

export default router;
