import jwt from 'jsonwebtoken';



export const authUser = async (req, res, next) => {

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Necesitas inciar sesion"})
  }

  try {
    const user = jwt.verify(token, procces.env.JWT_SECRET)

    //Aca se guarda la informacion de el usuario de la cookie
    req.authUser = user;

    next()

  } catch (error) {

    return res.status(401).json({
      message: "Se vencio o expiro el token"
    });

  }

};
2
