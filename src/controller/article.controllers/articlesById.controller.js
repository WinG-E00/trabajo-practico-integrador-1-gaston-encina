import Article from "../../models/article.model.js";


export const articlesById = async (req, res) => {
  try {

    const userId = req.params.id;


    //Obtener todos los articulos por id de usuario
    const allArticles = await Article.findAll({
      where:{
        id: userId
    }
    })

    return res.status(200).json({ message: 'Se encontraron estos articulos', allArticles })

  } catch (error) {

    return res.status(500).json({ message: 'Hubo un erro al intentar buscar los articulos por id', error });

  }

};
