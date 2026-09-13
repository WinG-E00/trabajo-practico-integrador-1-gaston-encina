import Article from "../../models/article.model.js";


export const createArticle = async (req, res) => {

  try {

    const { title, content, excerpt, status } = req.body;

    const createdArticle = await Article.create({
      title,
      content,
      excerpt,
      status
    })

    return res.status(201).json({ message: "se creo con exito el nuevo articulo", createdArticle })


  } catch (error) {

    return res.status(500).json({ message: "Hubo un error al crear un article", error })


  }


}
