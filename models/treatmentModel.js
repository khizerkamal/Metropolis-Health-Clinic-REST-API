const mongoose = require('mongoose')

const treatmentSchema = new mongoose.Schema({
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: [ true,'This field is required' ],
    },
    treatment: {
        type: String,
        required: [ true,'This field is required' ],
    },
})

const Treatment = mongoose.model('Treatment',treatmentSchema,'Treatment')
module.exports = Treatment