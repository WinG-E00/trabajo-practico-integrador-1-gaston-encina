import Tag from "../../models/tag.model";

export const getSpecificTag = async (req, res) => {
  try {

    const tagId = req.params.id


    //encontrar usuario por pk
    const tagEcontrardo = await Tag.findByPk(tagId);


    return res.status(200).json({ message: "Se econtro el tag por su id", tagEcontrardo });


  } catch (error) {

    return res.status(500).json({ message: "No se encontro el tag", error})


  }
}
