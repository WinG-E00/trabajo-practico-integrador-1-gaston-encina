
import { hashPassword } from "../../helpers/bcrypt.helper.js";
import User from "../../models/user.model.js";

export const register = async (req, res) => {
try {
  const { username, email, password, role } = req.body;

// 1. Hashear la contraseña ANTES de guardar
  const hashedPassword = await hashPassword(password);
  
  await User.create({
    username,
    email,
    password: hashedPassword,
    role
  });

  return res.status(201).json({ message: "Usuario registrado exitosamente" });
  

} catch (error) {
return res.status(500).json({ message: "Error al registrar usuario",
error });
}
};
