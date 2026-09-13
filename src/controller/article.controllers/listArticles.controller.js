import Article from "../../models/article.model.js";



export const listArticles = async (req, res) => {

  try {

    const todosLosArticulos = await Article.findAll();

    return res.status(200).json({ message: "Se listaron todos los Articulos", todosLosArticulos });

  } catch (error) {

    return res.status(500).json({ message: "Hubo un error al listar los Articulos", error })


  }



};
