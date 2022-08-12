import crypto from 'crypto';
// Create a key for encrypting
var salt = 'tennis_lesson_manager_for_my_brother';
/**
 * This function encrypts the received password as a parameter and returns it encrypted
 */
export var encodePassword = function (pass) {
    //We use the crypto library to encrypt the pass using 1000 iterations.
    return crypto.pbkdf2Sync(pass, salt, 1000, 64, "sha512").toString("hex");
};
/**
 * Generate a hexadecimal 128 bytes randon token
 */
export var generateValidationToken = function () {
    return crypto.randomBytes(128).toString('hex');
};
