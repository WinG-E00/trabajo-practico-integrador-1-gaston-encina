import { body, validationResult } from 'express-validator';
import User from '../../../models/user.model';

//Me falta corregir la sintaxis
export const userValidator = [
  body('username')
    .notEmpty()
    .withMessage("El username no puede estar vacio")
    .isAlphanumeric()
    .withMessage("El username debe ser de tipo alfanumerico")
    .custom(
      async (username) => {
  const existeAlgunUsuario => await findOne({
    where: {
            username: username
          }
        })

      }
    ),

    body('email')
      .notEmpty()
      .withMessage('El email no puede estar vacio')
      .isEmail()
      .withMessage('El email tiene que tener un formato valido')
      .custom(async (email) => {

        const userEmailExisting = await User.findOne({
          where: {
            email
          }
        })

        if (userEmailExisting) {
          throw new Error('El email ya esta registrado')
        }

      } ),

      body('password')
        .notEmpty()
        .withMessage('La contraseña no puede estar vacia')
        .isLength({min: 8})

];
