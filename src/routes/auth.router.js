import { Router } from "express";

//Import de controladores

//Controlador de register
import { register } from '../controller/authController/register.controller.js';
import { login } from '../controller/authController/login.controller.js'
import { logout } from '../controller/authController/logout.controller.js';
import { loginValidator, registerValidator } from '../middlewares/validators/user.validators/user.validator.js';

import { profileValidator } from '../middlewares/validators/profile.validators/profile.validator.js';

const router = Router();


router.post('/register', registerValidator, profileValidator, register);
router.post('/login', loginValidator, login);
// router.get('/profile');
// router.put('/profile');
router.post('/logout', logout);


export default router;
