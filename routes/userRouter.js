const { Router } = require('express');
const { userController } = require('../controllers/app');
const { userMiddleware } = require('../middlewares/app');

const router = Router();

router.post('/', userController.createUser);

router.get('/', userController.getUsers);

router.get('/:id', userMiddleware.checkUserId, userController.getUser);

router.patch('/:id', userMiddleware.checkUserId, userController.updateUser);

router.delete('/:id', userMiddleware.checkUserId, userController.deleteUser);

module.exports = router;
