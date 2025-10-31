const mongoose = require('mongoose');

const latLngSchema = new mongoose.Schema({
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
}, { _id: false });

const pickupPointSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    groupName: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    gps: { type: latLngSchema, required: true },
    contactPerson: { type: String, required: true },
    contactPhone: { type: String, required: true }
});

module.exports = mongoose.model('PickupPoint', pickupPointSchema);
