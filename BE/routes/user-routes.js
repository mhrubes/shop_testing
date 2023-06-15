const express = require('express');
const router = express.Router();
const { ItemUser } = require('../model/user-model');

// Endpoint pro získání všech položek
router.get('/getAllUsers', async (req, res) => {
    try {
        const users = await ItemUser.find({});
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
