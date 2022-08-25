import express from "express";
import { validateUser } from "./auth.middleware.js";
import { registerCtrl, resendEmailValidationCtrl, validateEmailCtrl, loginCtrl } from "./auth.controller.js";


export const router = express.Router();

// endpoint for user register
router.post('/register', validateUser, registerCtrl);

// endpoint to resend validation email
router.get('/resendEmail', resendEmailValidationCtrl);

//endpoint to validate user email
router.get('/validate', validateEmailCtrl);

//endpoint to user login
router.post('/login', loginCtrl)


export default router;