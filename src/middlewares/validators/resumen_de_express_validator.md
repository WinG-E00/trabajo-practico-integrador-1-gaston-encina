# Resumen de Métodos de express-validator

`express-validator` es un conjunto de middlewares de Express.js que envuelve la librería `validator.js` para proveer funciones de validación y sanitización de datos.

## 1. Cadenas de Validación (Orígenes de Datos)
Estos métodos indican en qué parte de la petición (Request) se debe buscar el campo a validar.

*   `body(campo)`: Busca solo en `req.body` (cuerpo de la petición, ej. POST/PUT).
*   `query(campo)`: Busca solo en `req.query` (parámetros de la URL, ej. `?id=1`).
*   `param(campo)`: Busca solo en `req.params` (parámetros de ruta, ej. `/user/:id`).
*   `header(campo)`: Busca en `req.headers` (cabeceras HTTP).
*   `cookie(campo)`: Busca en `req.cookies`.
*   `check(campo)`: **(Deprecado/Desaconsejado)** Busca en todos los anteriores en orden (body, query, param, headers, cookies). Es mejor ser explícito.

## 2. Validadores Estándar (Más comunes)
Se encadenan después de indicar el origen del dato.

*   `.notEmpty()`: Falla si el valor está vacío (string vacío, null, undefined).
*   `.isEmail()`: Verifica que el formato sea un correo electrónico válido.
*   `.isLength({ min, max })`: Comprueba que la longitud de un string esté entre un mínimo y un máximo.
*   `.isString()` / `.isNumeric()` / `.isBoolean()`: Verifica el tipo de dato subyacente o su formato.
*   `.isInt({ min, max })` / `.isFloat()`: Verifica que sea un número entero o decimal.
*   `.isIn(array)`: Verifica que el valor sea igual a uno de los elementos del array dado.
*   `.matches(regex)`: Verifica que el valor coincida con una expresión regular.
*   `.isURL()`: Verifica que sea una URL válida.

## 3. Sanitizadores (Modificadores de datos)
Alteran o limpian el dato recibido antes de que llegue a tu controlador.

*   `.trim()`: Elimina los espacios en blanco al principio y al final del string.
*   `.escape()`: Reemplaza caracteres HTML (`<`, `>`, `&`, `'`, `"`) para prevenir ataques XSS.
*   `.toLowerCase()` / `.toUpperCase()`: Convierte a minúsculas o mayúsculas.
*   `.toInt()` / `.toFloat()`: Convierte el string recibido en un número (útil porque los datos de requests HTTP suelen llegar como strings).
*   `.toBoolean()`: Convierte el valor a un tipo booleano.
*   `.normalizeEmail()`: Estandariza correos electrónicos (ej. ignora puntos en Gmail, pasa a minúsculas).

## 4. Personalización y Errores

*   `.withMessage('Tu mensaje aquí')`: Define el mensaje de error para el validador **inmediatamente anterior**.
    *   *Ejemplo:* `body('email').isEmail().withMessage('No es un email válido')`
*   `.custom((value, { req }) => { ... })`: Permite crear tu propia lógica de validación. Debe devolver `true`, lanzar un error (`throw new Error(...)`), o devolver una Promesa para validaciones asíncronas (ej. chequear en la base de datos).
*   `.customSanitizer(value => { ... })`: Permite aplicar transformaciones de datos personalizadas.
*   `.optional({ nullable: true, checkFalsy: true })`: Hace que la validación se omita si el campo no existe, es null o un valor "falsy".

## 5. Manejo de Resultados (En el Controlador)
Se utilizan dentro del controlador final de la ruta para extraer los errores o los datos limpios.

*   `validationResult(req)`: Extrae los errores de validación de la petición.
    *   `.isEmpty()`: Devuelve `true` si no hay errores.
    *   `.array()`: Devuelve un arreglo con todos los objetos de error.
*   `matchedData(req)`: Extrae y devuelve un objeto **únicamente** con los datos que han sido validados exitosamente, ignorando cualquier otro campo extra no deseado enviado en la petición.

---

### Ejemplo de Integración Completa

```javascript
const { body, validationResult, matchedData } = require('express-validator');

app.post('/registro', [
  // 1. Array de middlewares de validación
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(),
  body('edad')
    .optional()
    .isInt({ min: 18 }).withMessage('Debes ser mayor de 18')
    .toInt()
], (req, res) => {
  // 2. Manejo de resultados
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  // 3. Extraer solo los datos validados y limpios
  const datosLimpios = matchedData(req);
  
  // Guardar datosLimpios en la base de datos...
  res.json({ mensaje: 'Éxito', datos: datosLimpios });
});
```