const express = require('express')
const authController = require('../controllers/authController')
const appointmentController = require('../controllers/appointmentController')

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

module.exports = router;