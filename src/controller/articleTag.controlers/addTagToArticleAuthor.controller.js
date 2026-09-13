import ArticleTag from "../../models/articleTag.model.js";
import Article from "../../models/article.js";

export const addTagToArticleAuthor = async (req, res) => {

  try {

    const articleId = req.params.id;

    const authorId = req.authUser.id;

    //
    const articuloEncontrado = await Article.findOne({
      where: {
        id: articleId
      }
    });

    if (!articuloEncontrado) {
      return res.status(404).json({ message: "Articulo no encontrado"})
    }


    //Verificar que el usuario sea el autor del articulo
    if (articuloEncontrado.userId !== authorId) {
      return res.status(403).json({ message:"No eres el propietario del articulo" })
    }

    //Creacion de referencia en la tabla de muchos a muchos
    const referenciaCreada = ArticleTag.create({
      articleId,
      tagId
    });

    return res.status(201).json({ message: "se vinculo correctamente la tag al articulo", referenciaCreada })


  } catch (error) {

    return res.status(500).json({ message: "Hubo un error al intentar crear la referencia", error })

  }


};
