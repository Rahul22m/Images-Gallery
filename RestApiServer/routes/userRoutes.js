import {Router} from 'express';

import { createUser, deleteUser, getAllUsers} from '../controllers/userController.js';

import { authentication, restrictTo } from '../controllers/authController.js';
const router = Router();



router.post('/users', authentication, restrictTo('Admin'), createUser);

router.get('/users', authentication,restrictTo('Admin'), getAllUsers);

router.delete('/users/:id', authentication, restrictTo('Admin'), deleteUser);

export default router;