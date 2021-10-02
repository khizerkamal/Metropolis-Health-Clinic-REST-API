const Appointment = require('../models/appointmentModel')
const Treatment = require('../models/treatmentModel')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')

exports.showData = catchAsync(async (req,res,next) => {
    const user = req.user
    if (user.userType === 'patient') {
        const appointments = await Appointment.find({ patientId: user.id })
        const doctors = await User.find({ userType: 'doctor', status: { $ne: false } })
        return res.status(200).json({
            status: 'success',
            appointments,
            doctors
        })
    }
    if (user.userType === 'doctor') {
        const appointments = await Appointment.find({ doctorId: user.id })
        let appointmentIds = []
        appointments.forEach(e => appointmentIds.push(e._id))
        const treatments = await Treatment.find({ appointmentId: {$in: appointmentIds}})
        return res.status(200).json({
            status: 'success',
            appointments,
            treatments
        })
    }
})