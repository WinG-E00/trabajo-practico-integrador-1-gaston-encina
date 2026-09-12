import { validationResult } from 'express-validator';

export const errorValidator = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({
      message: `Acceso Denegado, da un error`,
      errors: errors.array().map(err => err.msg)
    });
  }
  next();
};
