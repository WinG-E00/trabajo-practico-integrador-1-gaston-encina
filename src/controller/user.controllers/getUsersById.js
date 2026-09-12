import User from '../../models/user.model.js'



export const getUsersById = async (req, res) => {
  try {
    //Traigo el id de params
    const idABuscar = req.params.id;

    //Busco el usuario en mi base de datos
    const usuarioEncontrado = await User.findByPk(idABuscar);

    //Si no encuentra el usuario
    if (!usuarioEncontrado) {
      throw new Error('El usuario no fue econtrado')
    }

    
    return res.status(200).json(usuarioEncontrado)


  } catch (error) {

    return res.status(500).json({ message: "Error al obtener usuario", error: error.message });

  }




};
