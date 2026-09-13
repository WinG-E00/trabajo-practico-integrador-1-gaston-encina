import Article from "../../models/article.model.js";


export const getArticlesByTokenAndId = async (req, res) => {

  try {

    //Ids importantes
    const tokenId = req.authUser.id;
    const articleId = req.params.id;

    //Obtener el Article por id y por tokenId del usuario logeado;
    const articuloObtenido = await Article.findOne({
      where: {
        userId: tokenId,
        id: articleId
      }
    })

    return res.status(200).json({ message: "Se obtuve el article con exito", articuloObtenido })

  } catch (err) {

    return res.status(500).json({ message: "No se pudo obtener el articulo por id del usuario", error })


  }


};
