const mongoose = require('mongoose');

const latLngSchema = new mongoose.Schema({
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
}, { _id: false });

const driverSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    shift: { type: String, enum: ['Day', 'Night'], required: true },
    holidayDate: { type: String, required: true },
    phone: { type: String, required: true },
    licenseType: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Inactive'], required: true },
    currentLocation: latLngSchema
});

module.exports = mongoose.model('Driver', driverSchema);
