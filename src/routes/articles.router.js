import Router from 'express';
import { nothingController } from '../controller/nothing.controller.js';


const router = Router();


router.post('/', nothingController);
router.get('/', nothingController);
router.get('/:id', nothingController);
router.get('/user', nothingController);
router.get('/user/:id', nothingController);
router.put('/:id', nothingController);
router.delete('/:id', nothingController);

export default router;