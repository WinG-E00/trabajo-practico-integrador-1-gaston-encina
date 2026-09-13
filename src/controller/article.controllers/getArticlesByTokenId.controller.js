import Article from "../../models/article.model.js";


export const getArticlesByTokenId = async (req, res) => {

  try {

    const userTokenId = req.authUser.id;

    const userArticles = await Article.findAll({
      where: {
        id: userTokenId
      }
    });

    return res.status(200).json({ message: 'Se obtuvieron todos los articulos del usuario logeado', userArticles });

  } catch (error) {

    return res.status(500).json({ message: 'Hubo un error al intentar traer los articulos del usuario', error });

  }



};
