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
import Article from '../models/article.model.js';
import { resourceIdValidator } from '../middlewares/validators/resource.validator.js';
import { articleUpdateValidator, articleValidator } from '../middlewares/validators/article.validators/article.validator.js';


const router = Router();

router.post('/', authUser, articleValidator, createArticle);
router.get('/', authUser,  listArticles);
router.get('/user', authUser, getArticlesByTokenId);
router.get('/user/:id', authUser, resourceIdValidator(Article, 'id', 'El artículo'), getArticlesByTokenAndId);
router.get('/:id', authUser, resourceIdValidator(Article, 'id', 'El artículo'), articlesById);
router.put('/:id', authUser, resourceIdValidator(Article, 'id', 'El artículo'), articleUpdateValidator, updateArticle);
router.delete('/:id', authUser, resourceIdValidator(Article, 'id', 'El artículo'), deleteArticle);


export default router;
