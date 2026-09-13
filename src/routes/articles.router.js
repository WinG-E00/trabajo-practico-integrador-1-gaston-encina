import Router from 'express';
import { nothingController } from '../controller/nothing.controller.js';
import { createArticle } from '../controller/article.controllers/createArticle.controller.js';
import { authUser } from '../middlewares/authMidlewares/authUser.js';
import { listArticles } from '../controller/article.controllers/listArticles.controller.js';
import { articlesById } from '../controller/article.controllers/articlesById.controller.js';
import { getArticlesByTokenAndId } from '../controller/article.controllers/getArticlesByTokenAndId.controller.js';
import { getArticlesByTokenId } from '../controller/article.controllers/getArticlesByTokenId.controller.js';
import { updateArticle } from '../controller/article.controllers/updateArticle.controller.js';
import { deleteArticle } from '../controller/article.controllers/deleteArticle.controller.js';


const router = Router();

router.post('/', authUser ,createArticle);
router.get('/', authUser,  listArticles);
router.get('/:id', authUser, articlesById);
router.get('/user', authUser, getArticlesByTokenId);
router.get('/user/:id', authUser , getArticlesByTokenAndId);
router.put('/:id', authUser, updateArticle);
router.delete('/:id', authUser , deleteArticle);


export default router;
