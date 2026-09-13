import Tag from "../../models/tag.model.js";


export const listAllTags = async (req, res) => {

  try {

    const allTags = await Tag.findAll();

    return res.status(200).json({ message: "Se encontraron todas las etiquetas", allTags })

  } catch (error) {

    return res.status(500).json({ message: "Hubo un error al intentar listar todas las etiquetas", error })
  }


};
