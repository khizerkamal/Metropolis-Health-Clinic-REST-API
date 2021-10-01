const express = require('express')
const authController = require('../controllers/authController')
const appointmentController = require('../controllers/appointmentController')
const treatmentController = require('../controllers/treatmentController')

const router = express.Router();

router.post('/login',authController.login)
router.post('/dashboard/:token',authController.regLogin)
router.post('/signup',authController.signup)

router.post(
    '/patient/bookAppointment',
    authController.protect,
    authController.restrictTo('patient'),
    appointmentController.bookAppointment
)
router.post(
    '/doctor/treatment',
    authController.protect,
    authController.restrictTo('doctor'),
    treatmentController.treatment
)
module.exports = router;