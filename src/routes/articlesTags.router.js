import { Router } from "express";
import { nothingController } from "../controller/nothing.controller.js";
import { addTagToArticleAuthor } from "../controller/articleTag.controlers/addTagToArticleAuthor.controller.js";
import { removeTagOnlyAuthor } from "../controller/articleTag.controlers/removeTagOnlyAuthor.controller.js";
import { authUser } from "../middlewares/authMidlewares/authUser.js";
import ArticleTag from '../models/articleTag.model.js';
import { resourceIdValidator } from '../middlewares/validators/resource.validator.js';
import { articleTagValidator } from '../middlewares/validators/article-tag.validators/articleTag.validator.js';


const router = Router();

router.post('/', authUser, articleTagValidator, addTagToArticleAuthor);
router.delete('/:articleTagId', authUser, resourceIdValidator(ArticleTag, 'articleTagId', 'La asociación artículo-etiqueta'), removeTagOnlyAuthor);

export default router;
