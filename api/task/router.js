const router = require('express').Router()
import { 
    addTask,
    getTasks,
    getSingleTask,
    getTaskComments,
    addTaskComment
} from "./service"

module.exports = (socket) => {
    router.post('/', addTask),
    router.get('/gettasks', getTasks),
    router.get('/getsingletask', getSingleTask),
    router.post('/comment/add', addTaskComment),
    router.get('/comment/get', getTaskComments)
    return router
};