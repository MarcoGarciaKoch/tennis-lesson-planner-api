import jwt from 'jsonwebtoken';
import { encodePassword, generateValidationToken } from './auth.utils.js';
import { sendValidationEmail } from '../adapters/email.js';
import { jwt_secret } from './auth.secrets.js';


/**
 * 1. Register data comes in the body. We need to validate the body.
 * 2. Generate user entity and save it in DDBB.
 * 3. Generate validation token and save it in DDBB on associated user.
 * 4. Send email with validation URL.
 */
 export const registerCtrl = async (req:any, res:any) => {
    try{
        //Check that email does not exist in DDBB - tennis-lesson-planner, collection - Users. If so send and error message.
        //Otherwise, encrypt the password sent in the body request.
        const user = await req.app.locals.ddbbClient.usersCol.findOne({email: req.body.email});
        if(user === null) {
            req.body.password = encodePassword(req.body.password);
            await req.app.locals.ddbbClient.usersCol.insertOne({ ...req.body, lessons: [], status: 'PENDING_VALIDATION' }); //Step 2
            //Step 3
            const token = generateValidationToken();
            await req.app.locals.ddbbClient.tokenCol.insertOne({token, user: req.body.email});
            //step 4
            // Be aware, host is our react app
            sendValidationEmail(req.body.email, `${process.env.FRONT_APP_URL}/validate?token=${token}`);
            res.sendStatus(201);
        }else {
            // send error 409(conflict) because user already exists on DDBB.
            res.sendStatus(409);
        }

    }catch (err){
        console.error(err);
        res.sendStatus(500)
    }
}

/**
 * 1. Check that user email exists on user entity and status is pending.
 * 2. Send email with validation URL.
 */
export const resendEmailValidationCtrl = async (req:any, res:any) => {
    const { email } = req.query
    try{
        //Check that email does exist in DDBB - tennis-lesson-planner, collection - Users. If so resend validation email.
        //Otherwise, send a error message.
        //Step 1
        const user = await req.app.locals.ddbbClient.usersCol.findOne({email});
        if(user !== null && user.status === 'PENDING_VALIDATION') {
            const validateToken = await req.app.locals.ddbbClient.tokenCol.findOne({user: email});
            //step 2
            // Be aware, host is our react app
            sendValidationEmail(email, `${process.env.FRONT_APP_URL}/validate?token=${validateToken.token}`);
            res.sendStatus(201);
        }else if(user !== null && user.status === 'SUCCESS') {
            // send error 409(conflict) because user is registered and can login.
            res.sendStatus(409)
        }else {
            // send error 404(not found) because user does not exist on DDBB.
            res.sendStatus(404);
        }

    }catch (err){
        console.error(err);
        res.sendStatus(500)
    }
}



/**
 * 1. Obetain the token
 * 2. Validate that token exists on DDBB and obtain the associated user.
 * 4. Update user changing status to SUCCESS.
 */

 export const validateEmailCtrl = async (req:any, res:any) => {
    const { token } = req.query; // step 1
    try{
        //Check that token already exists on DDBB - tennis-lesson-planner, collection - validate-token and update user status.
        //Otherwise, send an error.
        const valToken = await req.app.locals.ddbbClient.tokenCol.findOne({token})
        if(valToken !== null) {
            //token exists
        await req.app.locals.ddbbClient.tokenCol.deleteOne({token}); // step 3
        //update the user status to SUCCESS
        const updateDoc = {
            $set: {
                status: 'SUCCESS'
            },
        };
        await req.app.locals.ddbbClient.usersCol.updateOne({email:valToken.user}, updateDoc); //step 4
        res.sendStatus(200)
        }else{
            res.sendStatus(404);
        }
    }catch(err){
        console.error(err);
    }    
}



/**
 * 1. Verify that user exists with password and status is SUCCESS
 *  a. Encrypt the body password
 * 2. Generate a JWT token.
 * 3. Returns it to the user.
 */

 export const loginCtrl = async (req:any, res:any) => {
    const { email, password } = req.body;

    //step 1
    try{
        const query = {
            email,
            password: encodePassword(password),
            status: 'SUCCESS'
        }
        const user = await req.app.locals.ddbbClient.usersCol.findOne(query);
        if(user !== null){
            //the user exist with this conditions
            const token = jwt.sign({ email: user.email, hola:'tennis-lesson-planner' }, jwt_secret); // step 2
            res.status(201).json({ access_token: token }); // step 3
        }else {
            // send error 404(not found) because user email or password do not exist on DDBB.
            res.sendStatus(404);
        }
    }catch(err){
        console.error(err);
        res.sendStatus(500)
    }
}