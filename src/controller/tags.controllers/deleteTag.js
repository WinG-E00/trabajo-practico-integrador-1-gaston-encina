import Tag from "../../models/tag.model.js";


export const deleteTag = async (req, res) => {
  try {

    const tagId = req.params.id;

    //
    const tagEncontrada = await Tag.findByPk(tagId);


    //Por si no la encuentra en la base de datos
    if (tagEncontrada) {
      await tagEncontrada.destroy();
    } else if(!tagEncontrada) {
      throw new Error("No se encontro la tag con el id", tagId)
    }

    return res.status(200).json({ message: "se borro corractamente la tag con la id ", tagId })

  } catch (error) {
    return res.status(500).json({ message: "Hubo un error al intentar borrar un tag", error })
  }
}
