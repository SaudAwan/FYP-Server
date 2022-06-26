const router = require('express').Router();
import { 
    addAgenda,
    getAgendas,
    updateAgenda,
    fetchSessionDays,
    addSessionDay,
    deleteSessionDay,
    addSession,
    updateSession,
    getSessions,
    openGoogleDrive,
    googleDriveCallback,
    googleDriveUpload
} from "./service";

module.exports = (socket) => {
    router.post('/', addAgenda)
    router.get('/', getAgendas)
    router.get('/sessions',getSessions)
    router.patch('/sessions/update',updateSession)
    router.get('/sessions/googledrive',openGoogleDrive)
    router.get('/sessions/googledrive/oauth/callback',googleDriveCallback(socket))
    router.get('/sessions/googledriveupload',googleDriveUpload)
    router.post('/sessions/day',addSessionDay)
    router.post('/sessions',addSession)
    router.delete('/sessions/:id',deleteSessionDay)
    router.get('/sessions/days',fetchSessionDays)
    router.patch('/update', updateAgenda)

    return router;
};