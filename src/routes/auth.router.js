import { Router } from "express";
import { nothingController } from "../controller/nothing.controller.js";

//Import de controladores

//Controlador de register
import { register } from '../controller/authController/register.controller.js';
import { login } from '../controller/authController/login.controller.js'

const router = Router();


router.post('/register', register );
router.post('/login', login);
// router.get('/profile');
// router.put('/profile');
// router.post('/logout');


export default router;
