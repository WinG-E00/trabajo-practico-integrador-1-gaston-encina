import { body } from 'express-validator';
import Tag from '../../../models/tag.model.js';
import { errorValidator } from '../../../helpers/errorValidator.helper.js';

const tagNameRule = body('name').notEmpty().withMessage('El nombre es obligatorio').bail()
  .isLength({ min: 2, max: 30 }).withMessage('El nombre debe tener entre 2 y 30 caracteres').bail()
  .matches(/^\S+$/).withMessage('El nombre no puede contener espacios').bail()
  .custom(async (name, { req }) => {
    const tag = await Tag.findOne({ where: { name } });
    if (tag && tag.id !== Number(req.params.id)) throw new Error('Ya existe una etiqueta con ese nombre');
  });

export const tagValidator = [tagNameRule, errorValidator];
export const tagUpdateValidator = [
  body('name').notEmpty().withMessage('El nombre es obligatorio').bail()
    .isLength({ min: 2, max: 30 }).bail().matches(/^\S+$/).bail()
    .custom(async (name, { req }) => {
      const tag = await Tag.findOne({ where: { name } });
      if (tag && tag.id !== Number(req.params.id)) throw new Error('Ya existe una etiqueta con ese nombre');
    }),
  errorValidator,
];
