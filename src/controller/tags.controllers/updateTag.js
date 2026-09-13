import Tag from "../../models/tag.model.js";


export const updateTag = async (req, res) => {
  try {
    const tagId = req.params.id;

    const tagName = req.body.name;

    const tagEncontrada = await Tag.findByPk(tagId);


    const tagActualizada = await tagEncontrada.update(
      { name: tagName },
      { where: {id: tagId} },
    )

    return res.status(200).json({ message: "Usuario actualizado con exito", tagActualizada });


  }catch(error) {

    return res.status(500).json({ message:  "hubo un error al intentar actualizar el tag", error })

  }

};
