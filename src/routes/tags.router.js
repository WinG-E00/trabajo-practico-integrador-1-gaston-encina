import Router from 'express';
import { nothingController } from '../controller/nothing.controller.js';
import { createTag } from '../controller/tags.controllers/createTag.js';
import { adminValidation } from '../middlewares/authMidlewares/isAdminValidator.middleware.js';
import { listAllTags } from '../controller/tags.controllers/listAllTags.js';
import { getSpecificTag } from '../controller/tags.controllers/getSpecificTag.js';
import { updateTag } from '../controller/tags.controllers/updateTag.js';
import { deleteTag } from '../controller/tags.controllers/deleteTag.js';
import { authUser } from '../middlewares/authMidlewares/authUser.js';
import Tag from '../models/tag.model.js';
import { resourceIdValidator } from '../middlewares/validators/resource.validator.js';
import { tagUpdateValidator, tagValidator } from '../middlewares/validators/tag.validators/tag.validator.js';


// ● POST /api/tags → Crear etiqueta (solo admin).
// ● GET /api/tags → Listar todas las etiquetas. (usuario autenticado)
// ● GET /api/tags/:id → Obtener etiqueta específica con artículos asociados (solo
// admin).
// ● PUT /api/tags/:id → Actualizar etiqueta (solo admin).
// ● DELETE /api/tags/:id → Eliminar etiqueta (solo admin).


const router = Router();

router.post('/', adminValidation, tagValidator, createTag);
router.get('/',authUser, listAllTags);
router.get('/:id', adminValidation, resourceIdValidator(Tag, 'id', 'La etiqueta'), getSpecificTag);
router.put('/:id', adminValidation, resourceIdValidator(Tag, 'id', 'La etiqueta'), tagUpdateValidator, updateTag);
router.delete('/:id', adminValidation, resourceIdValidator(Tag, 'id', 'La etiqueta'), deleteTag);


export default router;
