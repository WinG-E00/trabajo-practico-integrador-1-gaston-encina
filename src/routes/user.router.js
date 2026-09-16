import { Router } from 'express';
//Controlador de prueba...
import { nothingController } from '../controller/nothing.controller.js';

//controladores
import { listAllUser } from '../controller/user.controllers/listAllUsers.js';
import { getUsersById } from '../controller/user.controllers/getUsersById.js';
import { createUser } from '../controller/user.controllers/createUser.js';
import { updateUser } from '../controller/user.controllers/updateUser.js';



//validadores
import { adminValidation } from '../middlewares/authMidlewares/isAdminValidator.middleware.js';
import { deleteUser } from '../controller/user.controllers/deleteUser.js';
import User from '../models/user.model.js';
import { resourceIdValidator } from '../middlewares/validators/resource.validator.js';
import { userUpdateValidator, userValidator } from '../middlewares/validators/user.validators/user.validator.js';



const router = Router();

// ● GET /api/users → Listar todos los usuarios con sus perfiles. (solo admin)
// ● GET /api/users/:id → Obtener usuario específico con perfil y artículos. (solo
// admin)
// ● POST /api/users → Crear un usuario con su perfil. (solo admin)
// ● PUT /api/users/:id → Actualizar usuario (solo admin).
// ● DELETE /api/users/:id → Eliminación lógica de usuario (solo admin).


router.get('/', adminValidation ,listAllUser );
router.get('/:id', adminValidation, resourceIdValidator(User, 'id', 'El usuario'), getUsersById);
router.post('/', adminValidation, userValidator, createUser);
router.put('/:id', adminValidation, resourceIdValidator(User, 'id', 'El usuario'), userUpdateValidator, updateUser);
router.delete('/:id', adminValidation, resourceIdValidator(User, 'id', 'El usuario'), deleteUser);


export default router;
