import { body } from 'express-validator';
import User from '../../../models/user.model.js';
import { errorValidator } from '../../../helpers/errorValidator.helper.js';

const uniqueUsername = async (username, { req }) => {
  const user = await User.findOne({ where: { username } });
  if (user && user.id !== Number(req.params.id)) {
    throw new Error('El nombre de usuario ya está ocupado');
  }
};

const uniqueEmail = async (email, { req }) => {
  const user = await User.findOne({ where: { email } });
  if (user && user.id !== Number(req.params.id)) {
    throw new Error('El email ya está registrado');
  }
};

const passwordRule = body('password')
  .notEmpty().withMessage('La contraseña no puede estar vacía')
  .bail()
  .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0 })
  .withMessage('La contraseña debe incluir 8 caracteres, una minúscula, una mayúscula y un número');

export const userValidator = [
  body('username').notEmpty().withMessage('El username no puede estar vacío').bail()
    .isLength({ min: 3, max: 20 }).withMessage('El username debe tener entre 3 y 20 caracteres').bail()
    .isAlphanumeric().withMessage('El username debe ser alfanumérico').bail()
    .custom(uniqueUsername),
  body('email').notEmpty().withMessage('El email no puede estar vacío').bail()
    .isEmail().withMessage('El email debe tener un formato válido').bail()
    .normalizeEmail().custom(uniqueEmail),
  passwordRule,
  body('role').notEmpty().withMessage('El rol no puede estar vacío').bail()
    .isIn(['user', 'admin']).withMessage('El rol debe ser user o admin'),
  errorValidator,
];

export const userUpdateValidator = [
  body('username').optional().notEmpty().bail().isLength({ min: 3, max: 20 }).bail()
    .isAlphanumeric().bail().custom(uniqueUsername),
  body('email').optional().notEmpty().bail().isEmail().bail().normalizeEmail().custom(uniqueEmail),
  body('password').optional().notEmpty().bail()
    .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0 })
    .withMessage('La contraseña debe incluir 8 caracteres, una minúscula, una mayúscula y un número'),
  body('role').optional().isIn(['user', 'admin']).withMessage('El rol debe ser user o admin'),
  body().custom(value => {
    if (!['username', 'email', 'password', 'role'].some(field => value[field] !== undefined)) {
      throw new Error('Enviá al menos un campo para actualizar');
    }
    return true;
  }),
  errorValidator,
];

export const registerValidator = [
  body('username').notEmpty().withMessage('El username no puede estar vacío').bail()
    .isLength({ min: 3, max: 20 }).bail().isAlphanumeric().bail().custom(uniqueUsername),
  body('email').notEmpty().withMessage('El email no puede estar vacío').bail()
    .isEmail().bail().normalizeEmail().custom(uniqueEmail),
  passwordRule,
  body('role').optional().isIn(['user']).withMessage('El registro público solo permite el rol user'),
  errorValidator,
];

export const loginValidator = [
  body('username').trim().notEmpty().withMessage('El username es obligatorio'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  errorValidator,
];
