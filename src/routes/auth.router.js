import { Router } from "express";
import { nothingController } from "../controller/nothing.controller.js";

const router = Router();


router.post('/register');
router.post('/login');
router.get('/profile');
router.put('/profile');
router.post('/logout');


export default router;