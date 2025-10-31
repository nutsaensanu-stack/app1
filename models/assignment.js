const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    driverId: { type: String, required: true },
    pickupPointId: { type: String, required: true },
    assignmentDate: { type: String, required: true },
    status: { type: String, enum: ['Completed', 'In Progress', 'Pending'], required: true },
    notes: { type: String }
});

module.exports = mongoose.model('Assignment', assignmentSchema);
