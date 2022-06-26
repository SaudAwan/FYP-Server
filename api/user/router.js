var router = require('express').Router();
import { 
    addUser,
    getUsers,
    userProfile,
    // deleteUser,
    getUsersCount,
    updateUser,
    getUser
} from './service';

router.post('/', addUser);
router.get('/', getUsers);
router.get('/count', getUsersCount);
router.get('/profile', userProfile);
// router.delete('/:userId', deleteUser);
router.patch('/:userId', updateUser);

router.get('/:userId', getUser);

module.exports = router;
