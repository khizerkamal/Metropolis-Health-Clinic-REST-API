const Treatment = require('../models/treatmentModel')

exports.bookAppointment = catchAsync(async (req,res,next) => {
    const treatment = await Treatment.create({
        appointmentId: req.body.appointmentId,
        treatment: req.body.treatment
    })

    res.status(201).json({
        status: 'success',
        treatment
    })
})