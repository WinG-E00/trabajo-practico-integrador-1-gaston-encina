import { comparePassword } from "../../helpers/bcrypt.helper.js"
import { generateToken } from "../../helpers/jwt.helper.js";

import User from "../../models/user.model.js";


export const login = async (req, res) => {

  const { username, password } = req.body;

  // 1. Buscar usuario en la base de datos
  const user = await User.findOne({
    where: { username }, // Solo buscamos por username
    include: {
      model: User,
      attributes: ["username"],
      as: "user",
    },
  });
  if (!user) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  // 2. Comparar contraseña ingresada con hash almacenado
  const validPassword = await comparePassword(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }


  // 3. Si la contraseña es correcta, generar JWT
  const token = generateToken({
    id: user.id,
    username: user.username
  });

  
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60, // 1 hora
  });
  return res.json({ message: "Login exitoso" });
};
