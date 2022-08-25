import * as EmailValidator from 'email-validator';
import jwt from 'jsonwebtoken';
import { jwt_secret } from './auth.secrets.js';
/***
 * Validate that email is correct
 * ...
 * If it isn´t, return error 400 (Bad Request)
 */
export var validateUser = function (req, res, next) {
    // If property email in the body request is valid, then we call the next middleware
    if (EmailValidator.validate(req.body.email)) {
        next(); // call next middleware
    }
    else {
        res.status(400).json({ error: 'Email not valid.' }); // If email is not valid, send response to client with a warning message.
    }
};
/**
 * Validate the token and if valid, add email to request
 */
export var validateAuth = function (req, res, next) {
    try {
        //Obtain the email from token
        var auth = req.header('Authorization'); // it returns the header value
        // What is the header structure? --> Bearer _token_jwt_
        var token = auth === null || auth === void 0 ? void 0 : auth.split(' ')[1]; // obtains the token
        var payload = jwt.verify(token, jwt_secret);
        //add attribute to request
        req.email = payload.email;
        next();
    }
    catch (err) {
        //The token is invalid or it does not exists
        console.error(err);
        res.sendStatus(401);
    }
};
