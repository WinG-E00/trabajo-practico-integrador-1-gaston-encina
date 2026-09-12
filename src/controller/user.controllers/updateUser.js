import User from '../../models/user.model.js';
import { hashPassword } from '../../helpers/bcrypt.helper.js';

export const updateUser = async (req, res) => {
  try {
    const usuarioEncontrado = await User.findByPk(req.params.id);

    if (!usuarioEncontrado) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Solo se actualizan los campos que llegaron en el body.
    const camposPermitidos = ['username', 'email', 'password', 'role'];
    const datosAActualizar = {};

    for (const campo of camposPermitidos) {
      if (req.body[campo] !== undefined) {
        datosAActualizar[campo] = req.body[campo];
      }
    }

    if (Object.keys(datosAActualizar).length === 0) {
      return res.status(400).json({
        message: 'Enviá al menos un campo para actualizar'
      });
    }

    // La contraseña nunca debe guardarse en texto plano.
    if (datosAActualizar.password) {
      datosAActualizar.password = await hashPassword(datosAActualizar.password);
    }

    await usuarioEncontrado.update(datosAActualizar);

    return res.status(200).json({
      message: 'Usuario actualizado correctamente',
      usuario: {
        id: usuarioEncontrado.id,
        username: usuarioEncontrado.username,
        email: usuarioEncontrado.email,
        role: usuarioEncontrado.role
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: 'No se pudo actualizar el usuario',
      error: error.message
    });
  }
};
