import { cookie, validationResult } from 'express-validator';
import { errorValidator } from '../ErrorCapturator/errorCapturator.js';
import jwt from 'jsonwebtoken';


export const adminValidation = [

  cookie('token')
    .notEmpty()
    .withMessage("El token no puede estar vacio")
    .custom((token, { req }) => {
      const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);

      if (tokenDecoded.role !== 'admin') {
        throw new Error('No tienes permisos de administrador')
      }

      req.userToken = tokenDecoded

      return true;

      
    }),

  errorValidator

]
