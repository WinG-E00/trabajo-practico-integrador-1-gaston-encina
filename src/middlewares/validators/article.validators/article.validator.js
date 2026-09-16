import { body } from 'express-validator';
import { errorValidator } from '../../../helpers/errorValidator.helper.js';

const articleFields = required => [
  body('title').if((value) => required || value !== undefined).notEmpty().withMessage('El título es obligatorio').bail()
    .isLength({ min: 3, max: 200 }).withMessage('El título debe tener entre 3 y 200 caracteres'),
  body('content').if((value) => required || value !== undefined).notEmpty().withMessage('El contenido es obligatorio').bail()
    .isLength({ min: 50 }).withMessage('El contenido debe tener al menos 50 caracteres'),
  body('excerpt').optional({ values: 'falsy' }).isString().bail().isLength({ max: 500 })
    .withMessage('El resumen debe tener como máximo 500 caracteres'),
  body('status').optional().isIn(['published', 'archived']).withMessage('El estado debe ser published o archived'),
];

export const articleValidator = [...articleFields(true), errorValidator];
export const articleUpdateValidator = [
  ...articleFields(false),
  body().custom(value => {
    if (!['title', 'content', 'excerpt', 'status'].some(field => value[field] !== undefined)) {
      throw new Error('Enviá al menos un campo para actualizar');
    }
    return true;
  }),
  errorValidator,
];
