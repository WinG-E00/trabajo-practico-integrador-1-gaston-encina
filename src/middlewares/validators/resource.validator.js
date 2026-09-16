import { body, param } from 'express-validator';
import { errorValidator } from '../../helpers/errorValidator.helper.js';

export const resourceIdValidator = (Model, parameter = 'id', resource = 'El recurso') => [
  param(parameter).isInt({ min: 1 }).withMessage(parameter + ' debe ser un entero positivo')
    .bail()
    .custom(async id => {
      const entity = await Model.findByPk(id);
      if (!entity) throw new Error(resource + ' no existe');
      return true;
    }),
  errorValidator,
];

export const positiveIdBodyValidator = (field, Model) => body(field)
  .notEmpty().withMessage(field + ' es obligatorio')
  .bail()
  .isInt({ min: 1 }).withMessage(field + ' debe ser un entero positivo')
  .bail()
  .custom(async id => {
    const entity = await Model.findByPk(id);
    if (!entity) throw new Error(field + ' no existe');
    return true;
  });
