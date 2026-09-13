import ArticleTag from "../../models/articleTag.model.js";



export const removeTagOnlyAuthor = async (req, res) => {

  try {

    const authorId = req.authUser.id;

    const conexionARemover = req.params.id;


    const ArticleTagEncontrado = await ArticleTag.findOne({
      where: {
        id: conexionARemover
      }
    })

    if (!ArticleTagEncontrado) {
      return res.status(404).json({ message: "No se encontro el ArticleTag a eliminar" });
    }

    //Eliminar la conexion entre la etiqueta y el articulo
    await ArticleTagEncontrado.destroy();


  } catch (error) {

    return res.status(500).json({ message: "Hubo un error al intentar eliminar el ArticleTag", error })

  }


};
