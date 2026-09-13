import Tag from "../../models/tag.model.js";
import ArticleTag from "../../models/articleTag.model.js";


export const createTag = async (req, res) => {

  try {

    //Nombre de la etiqueta sacado del req
    const nombreDeEtiqueta = req.body.name;

    //Crea el registro de la etiqueta
    const etiquetaCreada = await Tag.create({
      name: nombreDeEtiqueta
    })


    return res.status(201).json({ message: "Se creo correctamente la etiqueta", etiquetaCreada })

  } catch (error) {

    return res.status(500).json({ message: "Hubo un error al crear la etiqueta",error })

  }


};
