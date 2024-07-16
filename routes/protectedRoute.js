const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const Auth = require('../models/Auth');
const router = express.Router();

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await Auth.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
});
module.exports = router;

