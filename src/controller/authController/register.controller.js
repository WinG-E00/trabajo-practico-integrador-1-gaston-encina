import { hashPassword } from '../../helpers/bcrypt.helper.js';
import sequelize from '../../config/database.js';
import User from '../../models/user.model.js';
import Profile from '../../models/profile.model.js';

export const register = async (req, res) => {
  try {
    const { username, email, password, first_name, last_name, biography } = req.body;
    const hashedPassword = await hashPassword(password);

    // Si falla el perfil, la transacción también deshace la creación del usuario.
    await sequelize.transaction(async (transaction) => {
      const user = await User.create({
        username, email, password: hashedPassword, role: 'user',
      }, { transaction });

      await Profile.create({
        userId: user.id,
        first_name,
        // El modelo existente utiliza las_name para la columna de apellido.
        las_name: last_name,
        biography: biography || null,
      }, { transaction });
    });

    return res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ errors: [{
        type: 'field', path: 'username', location: 'body',
        msg: 'El usuario o el correo electrónico ya están registrados.',
      }] });
    }
    return res.status(500).json({ message: 'Error al registrar usuario' });
  }
};
