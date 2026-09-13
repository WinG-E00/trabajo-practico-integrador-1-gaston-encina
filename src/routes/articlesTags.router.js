import { Router } from "express";
import { nothingController } from "../controller/nothing.controller.js";
import { addTagToArticleAuthor } from "../controller/articleTag.controlers/addTagToArticleAuthor.controller.js";
import { removeTagOnlyAuthor } from "../controller/articleTag.controlers/removeTagOnlyAuthor.controller.js";
import { authUser } from "../middlewares/authMidlewares/authUser.js";


const router = Router();

router.post('/', authUser, addTagToArticleAuthor );
router.delete('/:articleTagId', authUser ,removeTagOnlyAuthor);

export default router;
