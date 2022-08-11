import crypto from 'crypto';

// Create a key for encrypting
const salt = 'tennis_lesson_manager_for_my_brother';

/**
 * This function encrypts the received password as a parameter and returns it encrypted
 */

 export const encodePassword = (pass:string) => {
    //We use the crypto library to encrypt the pass using 1000 iterations.
    return crypto.pbkdf2Sync(pass, salt, 1000, 64, `sha512`).toString(`hex`);
}


/**
 * Generate a hexadecimal 128 bytes randon token
 */

 export const generateValidationToken = () => {
    return crypto.randomBytes(128).toString('hex');
}