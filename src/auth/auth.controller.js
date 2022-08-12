var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
export var registerCtrl = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, token, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                return [4 /*yield*/, req.app.locals.ddbbClient.usersCol.findOne({ email: req.body.email })];
            case 1:
                user = _a.sent();
                if (!(user === null)) return [3 /*break*/, 4];
                req.body.password = encodePassword(req.body.password);
                return [4 /*yield*/, req.app.locals.ddbbClient.usersCol.insertOne(__assign(__assign({}, req.body), { status: 'PENDING_VALIDATION' }))];
            case 2:
                _a.sent(); //Step 2
                token = generateValidationToken();
                return [4 /*yield*/, req.app.locals.ddbbClient.tokenCol.insertOne({ token: token, user: req.body.email })];
            case 3:
                _a.sent();
                //step 4
                // Be aware, host is our react app
                sendValidationEmail(req.body.email, "".concat(process.env.FRONT_APP_URL, "/validate?token=").concat(token));
                res.sendStatus(201);
                return [3 /*break*/, 5];
            case 4:
                // send error 409(conflict) because user already exists on DDBB.
                res.sendStatus(409);
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                err_1 = _a.sent();
                console.error(err_1);
                res.sendStatus(500);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
/**
 * 1. Obetain the token
 * 2. Validate that token exists on DDBB and obtain the associated user.
 * 4. Update user changing status to SUCCESS.
 */
export var validateEmailCtrl = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, valToken, updateDoc, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = req.query.token;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                return [4 /*yield*/, req.app.locals.ddbbClient.tokenCol.findOne({ token: token })];
            case 2:
                valToken = _a.sent();
                if (!(valToken !== null)) return [3 /*break*/, 5];
                //token exists
                return [4 /*yield*/, req.app.locals.ddbbClient.tokenCol.deleteOne({ token: token })];
            case 3:
                //token exists
                _a.sent(); // step 3
                updateDoc = {
                    $set: {
                        status: 'SUCCESS'
                    },
                };
                return [4 /*yield*/, req.app.locals.ddbbClient.usersCol.updateOne({ email: valToken.user }, updateDoc)];
            case 4:
                _a.sent(); //step 4
                res.sendStatus(200);
                return [3 /*break*/, 6];
            case 5:
                res.sendStatus(404);
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                err_2 = _a.sent();
                console.error(err_2);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
/**
 * 1. Verify that user exists with password and status is SUCCESS
 *  a. Encrypt the body password
 * 2. Generate a JWT token.
 * 3. Returns it to the user.
 */
export var loginCtrl = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, query, user, token, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                query = {
                    email: email,
                    password: encodePassword(password),
                    status: 'SUCCESS'
                };
                return [4 /*yield*/, req.app.locals.ddbbClient.usersCol.findOne(query)];
            case 2:
                user = _b.sent();
                if (user !== null) {
                    token = jwt.sign({ email: user.email, hola: 'tennis-lesson-planner' }, jwt_secret);
                    res.status(201).json({ access_token: token }); // step 3
                }
                else {
                    res.sendStatus(404);
                }
                return [3 /*break*/, 4];
            case 3:
                err_3 = _b.sent();
                console.log(err_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
