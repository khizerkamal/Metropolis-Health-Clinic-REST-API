const express = require('express')
const authController = require('../controllers/authController')
const appointmentController = require('../controllers/appointmentController')
const treatmentController = require('../controllers/treatmentController')
const dashboardController = require('../controllers/dashboardController')

const router = express.Router();

router.post('/login',authController.login)
router.post('/signup',authController.signup)
router.post('/login/:token',authController.regLogin)

router.get(
    '/dashboard',
    authController.protect,
    dashboardController.showData
)

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