import { Router } from "express";
import { nothingController } from "../controller/nothing.controller.js";


const router = Router();

router.post('/', nothingController );
router.delete('/:articleTagId', nothingController);

export default router;