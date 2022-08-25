import express from "express";
import { getLessonsListCtrl, registerNewLessonCtrl, updateLessonCtrl, deleteLessonCtrl } from './users.controller.js';
var router = express.Router();
router.get('/lessonsList', getLessonsListCtrl);
router.post('/newLesson', registerNewLessonCtrl);
router.patch('/updateLesson', updateLessonCtrl);
router.delete('/deleteLesson', deleteLessonCtrl);
export default router;
