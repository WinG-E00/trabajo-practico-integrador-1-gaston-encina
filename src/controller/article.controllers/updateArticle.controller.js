import Article from "../../models/article.model.js";



export const updateArticle = async (req, res) => {
  try {

    //Parametros del que llegan del body
    const { title, content, excerpt, status } = req.body;


    const findedArticle = req.params.id;

    //verificar si es author o admin
    const esAutor = req.authUser.id === findedArticle.id;
    const esAdmin = req.authUser.role === 'admin';


    //Si las dos condicones no se cumplen pasa la condicional y retorna respuesta
    if (!esAutor && !esAdmin) {
      return res.status(403).json({ message: "No esta autorizado para realizar esta accion" })
    }


    //Los parametros que se van a usar para actualizar el registro
    const parametersForUpdate = {};

    if (title !== undefined) { parametersForUpdate.title = title };
    if (content !== undefined) { parametersForUpdate.content = content };
    if (excerpt !== undefined) { parametersForUpdate.excerpt = excerpt };
    if (status !== undefined) { parametersForUpdate.status = status };

    const updatedArticle = await findedArticle.update(parametersForUpdate)


    return res.status(200).json({ message: "Se actualizo correctamente el articulo", updatedArticle })



  } catch (error) {

    return res.status(500).json({ message: "No se pudo actualizar el articulo debido a el error", error })

  }

};
