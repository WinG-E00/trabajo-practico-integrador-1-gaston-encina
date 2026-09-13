import Article from "../../models/article.model.js";


export const deleteArticle = async (req, res) => {



  try {

    const articuloAElimar = req.params.id;

    //Articulo encontrado
    const findedArticle = await Article.findOne({
      where: {
        id: articuloAElimar
      }
    });

    if (!findedArticle) {
      return res.status(404).json({ message: "Articulo no encontrado"})
    }

    //verificar si es author o admin
    const esAutor = req.authUser.id === findedArticle.id;
    const esAdmin = req.authUser.role === 'admin';

    //Si las dos condicones no se cumplen arroja error
    if (!esAutor && !esAdmin) {
      return res.status(403).json({ message: "No esta autorizado para realizar esta accion" })
    }

    //Eliminar articulo
    await findedArticle.destroy();


    return res.status(200).json({ message: 'Se elimino correctamente el articulo' })


  } catch(error){

    return res.status(500).json('Hubo un error al intentar eliminar un articulo', error);

  }

};
