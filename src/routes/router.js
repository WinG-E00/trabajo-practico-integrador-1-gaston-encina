import { Router } from 'express';



//User router
import userRouter from './user.router.js';
import tagsRouter from './tags.router.js'
import articlesRouter from './articles.router.js'
import articleTagsRouter from './articlesTags.router.js'
import authRouter from './auth.router.js'

const router = Router();

//Configuracion de los otros routers
router.use('/users', userRouter);
router.use('/tags', tagsRouter);
router.use('/articles', articlesRouter);
router.use('/articles-tags', articleTagsRouter);
router.use('/auth', authRouter);


export default router;
