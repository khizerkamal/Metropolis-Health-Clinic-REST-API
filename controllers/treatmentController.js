const Treatment = require('../models/treatmentModel')
const catchAsync = require('../utils/catchAsync')

exports.treatment = catchAsync(async (req,res,next) => {
    const treatment = await Treatment.create({
        appointmentId: req.body.appointmentId,
        treatment: req.body.treatment
    })

    res.status(201).json({
        status: 'success',
        treatment
    })
})