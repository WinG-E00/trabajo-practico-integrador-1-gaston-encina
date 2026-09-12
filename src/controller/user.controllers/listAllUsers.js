//importacion de los modelos para poder usar metodos de el propio modelos
import User from '../../models/user.model.js'

//import de jsonwebtoken para ver las cookies

  //Controlador para obtener todos los usuarios
export const listAllUser = async (req, res) => {
  try {
    const allUsers = await User.findAll()

    return res.status(200).json(allUsers)

    
    
  }catch (error){
    return res.status(500).json({ message: "Error al obtener todos los usuarios", error: error.message });
  }

}
