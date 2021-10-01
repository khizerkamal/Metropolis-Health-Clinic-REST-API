const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: [ true,'This field is required' ],
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: [ true,'This field is required' ],
    },
    time: {
        type: String,
        required: [ true,'This field is required' ],
    },
    status: {
        type: String,
        required: [ true,'This field is required' ],
        enum: [ 'done','pending' ],
        default: 'pending'
    },
})

const Appointment = mongoose.model('Appointment',appointmentSchema,'Appointment')
module.exports = Appointment