const Treatment = require('../models/treatmentModel')
const Appointment = require('../models/appointmentModel')
const catchAsync = require('../utils/catchAsync')

exports.treatment = catchAsync(async (req,res,next) => {
    const treatment = await Treatment.create({
        appointmentId: req.body.appointmentId,
        treatment: req.body.treatment
    })
  
    const appointment = await Appointment.findById(treatment.appointmentId)
    console.log(appointment)
    appointment.status = 'done'
    await appointment.save();

    res.status(201).json({
        status: 'success',
        treatment
    })
})