import Router from 'express';
import { nothingController } from '../controller/nothing.controller.js';
import { createTag } from '../controller/tags.controllers/createTag.js';
import { adminValidation } from '../middlewares/authMidlewares/isAdminValidator.middleware.js';
import { listAllTags } from '../controller/tags.controllers/listAllTags.js';
import { getSpecificTag } from '../controller/tags.controllers/getSpecificTag.js';


// ● POST /api/tags → Crear etiqueta (solo admin).
// ● GET /api/tags → Listar todas las etiquetas. (usuario autenticado)
// ● GET /api/tags/:id → Obtener etiqueta específica con artículos asociados (solo
// admin).
// ● PUT /api/tags/:id → Actualizar etiqueta (solo admin).
// ● DELETE /api/tags/:id → Eliminar etiqueta (solo admin).


const router = Router();

router.post('/', adminValidation ,createTag);
router.get('/',/*Me falta un validador que verifi que el usuario esta autorizado */ listAllTags);
router.get('/:id', adminValidation, getSpecificTag);
router.put('/:id', nothingController);
router.delete('/:id', nothingController);


export default router;
