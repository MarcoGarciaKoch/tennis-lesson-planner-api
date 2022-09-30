import express from "express";
import { getUserDataCtrl, registerNewLessonCtrl, updateLessonCtrl, deleteLessonCtrl } from './users.controller.js'


const router = express.Router();

router.get('/userData', getUserDataCtrl)
router.post('/newLesson', registerNewLessonCtrl);
router.patch('/updateLesson', updateLessonCtrl);
router.delete('/deleteLesson', deleteLessonCtrl);


export default router;