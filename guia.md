# Guía breve para crear el proyecto

Este proyecto es una API de artículos con usuarios, perfiles y etiquetas. Usa Node.js, Express, MySQL y Sequelize. Los pasos están ordenados para construirla desde cero siguiendo la estructura del repositorio.

## 1. Preparación

1. Instalá Node.js con soporte para `node --watch`, npm y MySQL.
2. Creá una carpeta para el proyecto y ejecutá:

   ```bash
   npm init -y
   npm install express sequelize mysql2 dotenv bcrypt jsonwebtoken cookie-parser cors express-validator
   ```

3. Agregá a `package.json` la propiedad `"type": "module"` y el script `"dev": "node --watch app.js"` dentro de `scripts`.
4. Creá esta estructura:

   ```text
   app.js
   src/
     config/        # Conexión y sincronización de la base
     models/        # Tablas y relaciones
     helpers/       # Contraseñas, JWT y errores de validación
     middlewares/   # Autenticación, permisos y validaciones
     controller/    # Operaciones de cada recurso
     routes/        # Endpoints y router principal
   ```

5. Incluí `node_modules/` y `.env` en `.gitignore`. Si trabajás con este repositorio ya descargado, usá `npm ci` para instalar las versiones del archivo de bloqueo.

## 2. Base de datos y configuración

1. En MySQL, creá la base con `CREATE DATABASE integrador;` y un usuario con permisos sobre ella.
2. Creá un `.env` en la raíz y ajustá los valores a tu entorno:

   ```dotenv
   PORT=3000
   DB_NAME=integrador
   DB_USER=tu_usuario
   DB_PASSWORD=tu_clave
   DB_HOST=localhost
   DB_PORT=3306
   JWT_SECRET=reemplazar_por_un_secreto_largo_y_aleatorio
   ```

3. En `src/config/database.js`, cargá `dotenv/config` y exportá una instancia de `Sequelize` con esas variables y `dialect: 'mysql'`.
4. En `database.sync.js`, importá los modelos y sus relaciones. Creá `initModels()` para ejecutar `sequelize.authenticate()` y `sequelize.sync()` antes de iniciar el servidor.

**Atención:** el código actual usa `sync({ force: true })`, que elimina y recrea las tablas en cada arranque. Para conservar los datos, usá `sync()` sin esa opción.

## 3. Modelos y relaciones

1. Definí los modelos con `sequelize.define`, usando identificadores autoincrementales y `timestamps: true`:

   | Modelo | Campos principales |
   | --- | --- |
   | `User` | `username`, `email`, `password`, `role` (`user` o `admin`) |
   | `Profile` | Nombre, apellido, biografía, avatar y fecha de nacimiento |
   | `Article` | `title`, `content`, `excerpt`, `status` |
   | `Tag` | `name` |
   | `ArticleTag` | Identificador de la asociación entre artículo y etiqueta |

2. Agregá restricciones: usuario y correo únicos, campos obligatorios y límites de longitud. En `User`, activá `paranoid: true` para la eliminación lógica.
3. En `relations.js`, conectá usuario y perfil con `hasOne`/`belongsTo`; usuario y artículos con `hasMany`/`belongsTo`; artículos y etiquetas con `belongsToMany`, usando `ArticleTag` como tabla intermedia.
4. Mantené los nombres consistentes: actualmente el modelo de perfil usa `las_name`, mientras el registro recibe `last_name` y lo convierte al guardar. Al reconstruirlo, podés unificar ambos como `last_name`.

## 4. Autenticación y validaciones

1. Creá helpers para hashear y comparar contraseñas con bcrypt, y generar/verificar JWT con `JWT_SECRET`. El token del proyecto dura una hora.
2. Implementá el registro: validá los datos y creá usuario y perfil dentro de una transacción, guardando la contraseña hasheada y el rol `user`.
3. Implementá el login: buscá al usuario, compará la contraseña y guardá el JWT en una cookie `token` con `httpOnly: true`. En logout, eliminá esa cookie.
4. Creá `authUser` para verificar la cookie y guardar el usuario en `req.authUser`; creá `adminValidation` para restringir operaciones al rol administrador.
5. Usá `express-validator` para validar cuerpos e identificadores, comprobar recursos existentes y devolver errores antes de ejecutar los controladores.

## 5. Controladores, rutas y servidor

1. Implementá controladores para crear, listar, consultar, actualizar y eliminar recursos. Usá los modelos de Sequelize y respuestas como `201` al crear, `401` sin sesión, `403` sin permisos y `404` si el recurso no existe.
2. Al crear artículos, guardá `userId: req.authUser.id`. Para modificarlos o eliminarlos, buscá primero el artículo y compará su `userId` con el usuario autenticado; permití también al administrador.
3. Organizá los routers por recurso y montalos en `router.js`:

   | Ruta base | Función |
   | --- | --- |
   | `/api/auth` | Registro, login y logout |
   | `/api/users` | Administración de usuarios |
   | `/api/articles` | Gestión y consulta de artículos |
   | `/api/tags` | Consulta de etiquetas y administración |
   | `/api/articles-tags` | Asociar o quitar etiquetas de artículos del autor |

4. En cada ruta, colocá los middlewares antes del controlador: autenticación o permisos, validación y operación.
5. En `app.js`, creá Express, habilitá `express.json()` y `cookieParser()`, configurá CORS para `http://localhost:5173` con `credentials: true` y montá el router en `/api`.
6. Agregá `GET /test` con respuesta `Ok`. Ejecutá `initModels()` antes de `app.listen(PORT)`.

## 6. Ejecución y comprobación

1. Con MySQL iniciado y el `.env` configurado, ejecutá `npm run dev`.
2. Comprobá `GET http://localhost:3000/test` en el navegador o Postman.
3. Registrá un usuario con `POST /api/auth/register`, enviando `username`, `email`, `password`, `first_name` y `last_name`; luego iniciá sesión con `POST /api/auth/login`.
4. Conservá la cookie para probar rutas protegidas. Desde un frontend, enviá las solicitudes con `credentials: 'include'`.
5. Probá artículos con título de 3 a 200 caracteres y contenido de al menos 50; verificá validaciones, permisos, asociaciones de etiquetas y logout. Para probar administración, asigná el rol `admin` a un usuario de prueba en la base y volvé a iniciar sesión.

**Detalles actuales a revisar al reconstruir:** corregí `defautlValue` por `defaultValue` y `notEmpy` por `notEmpty` en los modelos. El controlador actual de creación de artículos no asigna el autor y el de actualización trata el identificador como un modelo; aplicá el paso 5.2 para implementar esas operaciones correctamente.
