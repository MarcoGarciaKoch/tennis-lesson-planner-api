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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
export var getUserDataCtrl = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, userOptions, userData, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                query = req.email;
                userOptions = { projection: { _id: 0, lessons: 1, name: 1, lastname: 1 } };
                return [4 /*yield*/, req.app.locals.ddbbClient.usersCol.findOne({ email: query }, userOptions)];
            case 1:
                userData = _a.sent();
                res.status(200).json(userData);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                console.error(err_1);
                res.sendStatus(500);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
export var registerNewLessonCtrl = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, updateDocument, userOptions, lessons, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                query = req.email;
                updateDocument = {
                    $push: { 'lessons': {
                            id: req.body.id,
                            date: req.body.date,
                            startTime: req.body.startTime,
                            finishTime: req.body.finishTime,
                            rate: req.body.rate,
                            price: req.body.price,
                            paid: req.body.paid,
                            type: req.body.type,
                            players: req.body.players,
                            club: req.body.club
                        } }
                };
                return [4 /*yield*/, req.app.locals.ddbbClient.usersCol.updateOne({ email: query }, updateDocument)];
            case 1:
                _a.sent();
                userOptions = { projection: { _id: 0, lessons: 1 } };
                return [4 /*yield*/, req.app.locals.ddbbClient.usersCol.findOne({ email: query }, userOptions)];
            case 2:
                lessons = _a.sent();
                res.status(200).json(lessons);
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                console.error(err_2);
                res.sendStatus(500);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
export var updateLessonCtrl = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, id_1, user, lessonsWithoutUpdatedLesson, updatedLessonsList, updateDocument, lessonOptions, lessonsList, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                query = req.email;
                id_1 = req.body.id;
                return [4 /*yield*/, req.app.locals.ddbbClient.usersCol.findOne({ email: query })];
            case 1:
                user = _a.sent();
                lessonsWithoutUpdatedLesson = user.lessons.filter(function (l) { return l.id !== id_1; });
                updatedLessonsList = __spreadArray(__spreadArray([], lessonsWithoutUpdatedLesson, true), [req.body], false);
                updateDocument = {
                    $set: {
                        lessons: updatedLessonsList
                    },
                };
                return [4 /*yield*/, req.app.locals.ddbbClient.usersCol.updateOne({ email: query }, updateDocument)];
            case 2:
                _a.sent();
                lessonOptions = { projection: { _id: 0, lessons: 1 } };
                return [4 /*yield*/, req.app.locals.ddbbClient.usersCol.findOne({ email: query }, lessonOptions)];
            case 3:
                lessonsList = _a.sent();
                res.status(200).json(lessonsList);
                return [3 /*break*/, 5];
            case 4:
                err_3 = _a.sent();
                console.error(err_3);
                res.sendStatus(500);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
export var deleteLessonCtrl = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, id_2, user, lessonsWithoutDeletedLesson, updateDocument, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                query = req.email;
                id_2 = req.body.id;
                return [4 /*yield*/, req.app.locals.ddbbClient.usersCol.findOne({ email: query })];
            case 1:
                user = _a.sent();
                lessonsWithoutDeletedLesson = user.lessons.filter(function (l) { return l.id !== id_2; });
                updateDocument = {
                    $set: {
                        lessons: lessonsWithoutDeletedLesson
                    },
                };
                return [4 /*yield*/, req.app.locals.ddbbClient.usersCol.updateOne({ email: query }, updateDocument)];
            case 2:
                _a.sent();
                res.status(200).json(lessonsWithoutDeletedLesson);
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                console.error(err_4);
                res.sendStatus(500);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
