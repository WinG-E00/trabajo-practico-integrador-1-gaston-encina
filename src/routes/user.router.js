import { Router } from 'express';
import { nothingController } from '../controller/nothing.controller.js';


const router = Router();

// ● GET /api/users → Listar todos los usuarios con sus perfiles. (solo admin)
// ● GET /api/users/:id → Obtener usuario específico con perfil y artículos. (solo
// admin)
// ● POST /api/users → Crear un usuario con su perfil. (solo admin)
// ● PUT /api/users/:id → Actualizar usuario (solo admin).
// ● DELETE /api/users/:id → Eliminación lógica de usuario (solo admin).


router.get('/', nothingController);
router.get('/:id', nothingController);
router.post('/', nothingController);
router.put('/:id', nothingController);
router.delete('/:id', nothingController);


export default router;