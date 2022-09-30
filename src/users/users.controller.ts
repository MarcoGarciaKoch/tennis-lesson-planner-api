import { LessonData } from "./users.model";


export const getUserDataCtrl = async (req:any, res:any) => {
    //call the user
    try {
        const query = req.email; // try to find the user by email
        const userOptions = { projection: {_id:0, lessons:1, name:1, lastname:1}}
        const userData = await req.app.locals.ddbbClient.usersCol.findOne({email: query}, userOptions);
        res.status(200).json(userData)
    }catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
}


export const registerNewLessonCtrl = async (req:any, res:any) => {
    //call the user
    try {
        
        const query = req.email; // try to find the user by email
        const updateDocument = {
            $push: {'lessons': {
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
            }}
        };
        await req.app.locals.ddbbClient.usersCol.updateOne({email: query}, updateDocument);
        const userOptions = { projection: {_id:0, lessons:1}}
        const lessons = await req.app.locals.ddbbClient.usersCol.findOne({email: query}, userOptions);
        res.status(200).json(lessons)
    }catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
}


export const updateLessonCtrl = async (req:any, res:any) => {
     //call the user
     try {
        const query = req.email; // try to find the user by email
        const id = req.body.id; // lesson id to update
        const user = await req.app.locals.ddbbClient.usersCol.findOne({email: query});
        const lessonsWithoutUpdatedLesson = user.lessons.filter((l:LessonData) => l.id !== id);
        const updatedLessonsList = [...lessonsWithoutUpdatedLesson, req.body]
        const updateDocument = {
            $set: {
                lessons: updatedLessonsList
            },
        };
        await req.app.locals.ddbbClient.usersCol.updateOne({email: query}, updateDocument);
        const lessonOptions = { projection: {_id:0, lessons:1}}
        const lessonsList = await req.app.locals.ddbbClient.usersCol.findOne({email: query}, lessonOptions);
        res.status(200).json(lessonsList)
    
    }catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
}



export const deleteLessonCtrl = async (req:any, res:any) => {
    //call the user
    try {
        const query = req.email; // try to find the user by email
        const id = req.body.id; // lesson id to delete
        // const userOptions = { projection: {_id:0, lessons:1}}
        const user = await req.app.locals.ddbbClient.usersCol.findOne({email: query});
        const lessonsWithoutDeletedLesson = user.lessons.filter((l:LessonData) => l.id !== id);
        const updateDocument = {
            $set: {
                lessons: lessonsWithoutDeletedLesson
            },
        };
        await req.app.locals.ddbbClient.usersCol.updateOne({email: query}, updateDocument);
        res.status(200).json(lessonsWithoutDeletedLesson)
    
    }catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
}