import { body } from 'express-validator';
import { errorValidator } from '../../../helpers/errorValidator.helper.js';

const lettersOnly = /^[\p{L}\s'-]+$/u;

export const profileValidator = [
  body('first_name').notEmpty().withMessage('El nombre no puede estar vacío').bail()
    .isLength({ min: 2, max: 50 }).bail().matches(lettersOnly).withMessage('El nombre solo puede contener letras'),
  body('last_name').notEmpty().withMessage('El apellido no puede estar vacío').bail()
    .isLength({ min: 2, max: 50 }).bail().matches(lettersOnly).withMessage('El apellido solo puede contener letras'),
  body('biography').optional({ values: 'falsy' }).isString().bail().isLength({ max: 500 })
    .withMessage('La biografía debe tener como máximo 500 caracteres'),
  body('avatar_url').optional({ values: 'falsy' }).isURL().withMessage('avatar_url debe ser una URL válida'),
  body('birth_date').optional({ values: 'falsy' }).isISO8601().toDate().withMessage('birth_date debe ser una fecha válida'),
  errorValidator,
];

export const profileUpdateValidator = [
  body('first_name').optional().notEmpty().bail().isLength({ min: 2, max: 50 }).bail().matches(lettersOnly),
  body('last_name').optional().notEmpty().bail().isLength({ min: 2, max: 50 }).bail().matches(lettersOnly),
  body('biography').optional({ values: 'falsy' }).isString().bail().isLength({ max: 500 }),
  body('avatar_url').optional({ values: 'falsy' }).isURL(),
  body('birth_date').optional({ values: 'falsy' }).isISO8601().toDate(),
  errorValidator,
];
