import {signUp, userLogin} from './service'

var router = require('express').Router();

router.post('/signUp', signUp);

router.post('/login', userLogin);

module.exports = router;
