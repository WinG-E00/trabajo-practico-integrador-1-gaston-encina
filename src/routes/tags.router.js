import Router from 'express';
import { nothingController } from '../controller/nothing.controller.js';


// ● POST /api/tags → Crear etiqueta (solo admin).
// ● GET /api/tags → Listar todas las etiquetas. (usuario autenticado)
// ● GET /api/tags/:id → Obtener etiqueta específica con artículos asociados (solo
// admin).
// ● PUT /api/tags/:id → Actualizar etiqueta (solo admin).
// ● DELETE /api/tags/:id → Eliminar etiqueta (solo admin).


const router = Router();
router.post('/', nothingController);
router.get('/', nothingController);
router.get('/:id', nothingController);
router.put('/:id', nothingController);
router.delete('/:id', nothingController);


export default router;
