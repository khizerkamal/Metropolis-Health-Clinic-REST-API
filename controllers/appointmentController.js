const Appointment = require('../models/appointmentModel')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')

exports.bookAppointment = catchAsync(async (req,res,next) => {
    const doctorId = await User.findOne({ name: req.body.doctorName })
    const newAppointment = await Appointment.create({
        doctorId,
        patientId: req.user._id,
        time: req.body.time,
    })

    res.status(201).json({
        status: 'success',
        appointment: newAppointment
    })
})