import User from "../../models/user.model";


export const deleteUser = async (req, res) => {
  try {

    //Creo constante que con informacion del req.body que va a tener un email
    const idUsuarioAEliminar = req.body.id


    //Encontrar el usuario en la base de datos
    const usuarioAEliminar = User.destroy({
      where: { id: idUsuarioAEliminar }
    })

        return res.status(200).json({ message: "Se borro correctamente el usuario"})

  } catch (error) {

    return res.status(500).json({ message: "Hubo un error al intentar eliminar un usuario"})

  }
}
