const router = require('express').Router();

const { getCurrentUser, editProfile } = require('../controllers/users');
const { userEditProfileCheck } = require('../utils/validation');

router.get('/users/me', getCurrentUser);
router.patch('/users/me', userEditProfileCheck, editProfile);

module.exports = router;
