const express = require('express');
const router = express.Router();

const Driver = require('../models/driver');
const PickupPoint = require('../models/pickupPoint');
const Assignment = require('../models/assignment');

// --- GET ALL DATA ---
router.get('/data', async (req, res) => {
    try {
        const drivers = await Driver.find();
        const pickupPoints = await PickupPoint.find();
        const assignments = await Assignment.find();
        res.json({ drivers, pickupPoints, assignments });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- DRIVERS API ---
router.put('/drivers/:id', async (req, res) => {
    try {
        const updatedDriver = await Driver.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        if (!updatedDriver) return res.status(404).json({ message: 'Driver not found' });
        res.json(updatedDriver);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/drivers/:id', async (req, res) => {
    try {
        const deletedDriver = await Driver.findOneAndDelete({ id: req.params.id });
        if (!deletedDriver) return res.status(404).json({ message: 'Driver not found' });
        res.json({ message: 'Driver deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/drivers/import', async (req, res) => {
    try {
        await Driver.deleteMany({});
        const newDrivers = await Driver.insertMany(req.body);
        res.status(201).json(newDrivers);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// --- PICKUP POINTS API ---
router.post('/pickup-points/import', async (req, res) => {
    try {
        await PickupPoint.deleteMany({});
        const newPoints = await PickupPoint.insertMany(req.body);
        res.status(201).json(newPoints);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// --- ASSIGNMENTS API ---
router.post('/assignments/import', async (req, res) => {
    try {
        await Assignment.deleteMany({});
        const newAssignments = await Assignment.insertMany(req.body);
        res.status(201).json(newAssignments);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
