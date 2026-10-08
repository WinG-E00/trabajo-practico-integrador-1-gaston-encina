# Métodos de Model en Sequelize 6

Referencia para Sequelize `6.37.x` y MySQL, usados en este proyecto. Incluye los métodos públicos del modelo, los de sus instancias y los métodos generados por asociaciones. No enumera funciones internas con prefijo `_`.

## 1. Modelo e instancia: la diferencia

Un **modelo** representa una tabla; una **instancia** representa un registro.

```js
import User from '../models/user.model.js';
import Article from '../models/article.model.js';
import Tag from '../models/tag.model.js';
import { Op } from 'sequelize';

// Método estático: se llama sobre el modelo.
const usuario = await User.findByPk(1);

// Método de instancia: se llama sobre el registro encontrado.
if (usuario) {
  await usuario.update({ username: 'nuevoNombre' });
}
```

Los ejemplos con `await` deben ejecutarse dentro de una función `async`. Las operaciones de base de datos pueden fallar: en un controlador, manejalas con `try/catch`.

## 2. Buscar registros

| Método del modelo | Qué hace | Resultado habitual |
| --- | --- | --- |
| `findByPk(id, opciones)` | Busca por clave primaria; en este proyecto, `id`. | Instancia o `null`. |
| `findOne(opciones)` | Busca el primer registro que coincida. Usá `order` si necesitás un orden definido. | Instancia o `null`. |
| `findAll(opciones)` | Busca todos los registros que coincidan. | Array de instancias; `[]` si no hay resultados. |
| `findAndCountAll(opciones)` | Busca una página y cuenta el total que coincide con el filtro. | `{ rows, count }`. Con `group`, `count` es un array de resultados por grupo. |

```js
const usuario = await User.findByPk(1);
const porCorreo = await User.findOne({ where: { email: 'ana@example.com' } });

const pagina = await Article.findAndCountAll({
  where: { status: 'published' },
  attributes: ['id', 'title', 'userId'],
  include: [{ association: 'author', attributes: ['id', 'username'] }],
  order: [['createdAt', 'DESC']],
  limit: 10,
  offset: 0,
});
// pagina.rows: hasta 10 artículos; pagina.count: total del filtro.
```

### Opciones frecuentes

| Opción | Uso |
| --- | --- |
| `where` | Condiciones: `{ role: 'admin' }`. |
| `attributes` | Columnas a devolver; también admite `{ exclude: ['password'] }`. |
| `include` | Carga relaciones; el alias debe coincidir con `relations.js`. |
| `order` | Orden, por ejemplo `[['id', 'DESC']]`. |
| `limit` / `offset` | Cantidad máxima y cantidad de registros a saltar. |
| `raw: true` | En consultas, devuelve objetos simples en lugar de instancias. No tendrán `.save()` o `.update()`. |
| `paranoid: false` | Incluye registros eliminados lógicamente de modelos con `paranoid`. |
| `transaction` | Ejecuta la operación dentro de la transacción indicada. |
| `logging` | Controla el registro SQL de la operación, por ejemplo `console.log`. |
| `rejectOnEmpty: true` | En búsquedas compatibles, lanza un error cuando no hay resultados. |

```js
const articulos = await Article.findAll({
  where: {
    title: { [Op.like]: '%Sequelize%' },
    id: { [Op.gt]: 5 },
    status: { [Op.in]: ['published', 'archived'] },
  },
});
```

Otros operadores: `Op.eq`, `Op.ne`, `Op.gte`, `Op.lt`, `Op.lte`, `Op.notIn`, `Op.between`, `Op.or` y `Op.and`. Son operadores para `where`, no métodos de `Model`.

## 3. Crear o preparar registros

| Método del modelo | Qué hace | Resultado |
| --- | --- | --- |
| `build(valores, opciones)` | Prepara una instancia en memoria, sin insertar. | Instancia; luego se guarda con `.save()`. |
| `bulkBuild(lista, opciones)` | Prepara varias instancias sin insertar. | Array de instancias. Método poco documentado en v6. |
| `create(valores, opciones)` | Construye y guarda un registro. | Promesa de la instancia creada. |
| `bulkCreate(lista, opciones)` | Inserta varios registros. | Promesa de un array de instancias. |
| `findOrBuild({ where, defaults })` | Busca; si no existe, prepara una instancia sin guardar. | `[instancia, construido]`. |
| `findOrCreate({ where, defaults })` | Busca; si no existe, inserta. | `[instancia, creado]`. |
| `findCreateFind({ where, defaults })` | Busca, intenta crear y vuelve a buscar ante conflicto de unicidad. | `[instancia, creado]`; alternativa avanzada con restricciones según dialecto/transacción. |
| `upsert(valores, opciones)` | Inserta o actualiza según la clave primaria o una restricción única. | `[instancia, creado]`; el indicador puede ser `null` en algunos dialectos. |

```js
const etiqueta = Tag.build({ name: 'JavaScript' });
await etiqueta.save();

const [otraEtiqueta, creada] = await Tag.findOrCreate({
  where: { name: 'Node.js' },
  defaults: { name: 'Node.js' },
});

await Tag.bulkCreate([{ name: 'Backend' }, { name: 'MySQL' }], {
  validate: true,
});
```

`bulkCreate` no ejecuta por defecto la validación individual: agregá `validate: true`. En MySQL, las instancias de una inserción masiva pueden no reflejar completamente los valores generados por la base; consultá de nuevo si necesitás esos datos exactos.

Para que `findOrCreate` evite duplicados bajo concurrencia, el campo debe tener una restricción única en la base. Actualmente `Tag.name` no la tiene. `upsert` también depende de las claves únicas: un filtro arbitrario no determina qué actualizar.

## 4. Actualizar, eliminar y restaurar

| Método del modelo | Qué hace | Resultado / detalle |
| --- | --- | --- |
| `update(valores, { where })` | Actualiza todos los registros del filtro. | En MySQL, `[cantidadAfectada]`, no las instancias actualizadas. |
| `increment(campos, opciones)` | Aumenta columnas numéricas mediante SQL. | Resultado dependiente del dialecto; consultá después para obtener los valores actuales. |
| `decrement(campos, opciones)` | Reduce columnas numéricas mediante SQL. | Igual consideración que `increment`. |
| `destroy({ where })` | Elimina los registros coincidentes. | Cantidad afectada. Con `paranoid: true`, marca `deletedAt`. |
| `restore({ where })` | Restaura registros eliminados lógicamente. | Solo funciona con `paranoid: true`. |
| `truncate(opciones)` | Vacía la tabla. | Operación global; no sirve para borrar un registro por filtro. |

```js
const [cantidad] = await Article.update(
  { status: 'archived' },
  { where: { userId: 1 } },
);

await User.destroy({ where: { id: 1 } }); // Eliminación lógica en este proyecto.
await User.restore({ where: { id: 1 } });

// Eliminación física de un usuario, incluso si el modelo es paranoid:
// await User.destroy({ where: { id: 1 }, force: true });
```

`update` y `destroy` requieren `where` salvo opciones específicas de eliminación global. Un `where: {}` alcanza todos los registros. En MySQL, `returning: true` no permite recuperar las filas de un `Model.update()` como ocurre en PostgreSQL.

Ejemplo numérico genérico, para un modelo que tenga una columna `stock`:

```js
// await Producto.increment('stock', { by: 2, where: { id: 1 } });
// await Producto.decrement('stock', { by: 1, where: { id: 1 } });
```

## 5. Contar y calcular

| Método del modelo | Función | Ejemplo |
| --- | --- | --- |
| `count(opciones)` | Cuenta registros; con `group`, devuelve resultados por grupo. | `await Article.count({ where: { userId: 1 } })` |
| `max(campo, opciones)` | Mayor valor del campo. | `await Article.max('id')` |
| `min(campo, opciones)` | Menor valor del campo. | `await Article.min('id')` |
| `sum(campo, opciones)` | Suma valores numéricos. | `await Article.sum('id')` (solo ilustrativo). |
| `aggregate(campo, funcion, opciones)` | Ejecuta una función de agregación SQL. | `await Article.aggregate('id', 'count')` |

Los resultados dependen del tipo de columna, la función y el dialecto; una agregación sin datos puede devolver `null`. Al contar con relaciones de varios registros, revisá `distinct: true` para evitar contar duplicados del JOIN.

## 6. Definición, tablas y scopes

Estos métodos se usan principalmente al configurar modelos, no en cada petición HTTP.

| Método del modelo | Función |
| --- | --- |
| `init(atributos, opciones)` | Inicializa una clase que extiende `Model`; alternativa a `sequelize.define()`. |
| `getAttributes()` | Devuelve la definición de sus atributos. |
| `getTableName()` | Devuelve el nombre de tabla; con esquema puede devolver un objeto. |
| `describe()` | Consulta las columnas de la tabla en la base. |
| `removeAttribute(nombre)` | Quita un atributo de la definición en memoria; no borra por sí solo la columna SQL. |
| `sync(opciones)` | Sincroniza la tabla del modelo; `force: true` la elimina y recrea, `alter: true` intenta modificarla. |
| `drop(opciones)` | Elimina la tabla completa. |
| `schema(nombre, opciones)` | Devuelve una variante del modelo asociada a un esquema. Su comportamiento depende del dialecto; MySQL no maneja esquemas como PostgreSQL. |
| `addScope(nombre, scope, opciones)` | Registra un conjunto reutilizable de opciones de consulta. |
| `scope(...scopes)` | Devuelve una variante del modelo con los scopes aplicados. |
| `unscoped()` | Devuelve una variante sin scopes, incluido el predeterminado. |

```js
Article.addScope('publicados', { where: { status: 'published' } });
const publicados = await Article.scope('publicados').findAll();
const todos = await Article.unscoped().findAll();
```

## 7. Asociaciones

| Método del modelo | Relación | Ejemplo del proyecto |
| --- | --- | --- |
| `hasOne(destino, opciones)` | Uno a uno; clave foránea en el destino. | `User.hasOne(Profile, { foreignKey: 'userId', as: 'profile' })` |
| `belongsTo(destino, opciones)` | Pertenece a otro registro; clave foránea en el origen. | `Article.belongsTo(User, { foreignKey: 'userId', as: 'author' })` |
| `hasMany(destino, opciones)` | Uno a muchos; clave foránea en el destino. | `User.hasMany(Article, { foreignKey: 'userId', as: 'article' })` |
| `belongsToMany(destino, opciones)` | Muchos a muchos, mediante tabla intermedia. | `Article.belongsToMany(Tag, { through: ArticleTag, as: 'tags' })` |

Devuelven objetos de asociación y agregan métodos a las instancias. Los nombres se generan a partir de `as`, singularizando cuando corresponde:

| Tipo | Métodos generados |
| --- | --- |
| `belongsTo` / `hasOne` | `getX()`, `setX()`, `createX()`. |
| `hasMany` / `belongsToMany` | `getXs()`, `countXs()`, `hasX()`, `hasXs()`, `setXs()`, `addX()`, `addXs()`, `removeX()`, `removeXs()`, `createX()`. |

```js
const articulo = await Article.findByPk(1);
if (articulo) {
  const autor = await articulo.getAuthor();
  const etiquetas = await articulo.getTags();
  await articulo.addTag(2); // ID de una etiqueta existente.
  await articulo.removeTag(2); // Quita la asociación, no elimina la etiqueta.
}
```

En este repositorio, `User.hasMany` usa el alias singular `article`; por eso los nombres generados pueden resultar poco intuitivos. Revisá `User.associations.article.accessors` para verlos. `setTags(lista)` reemplaza el conjunto de asociaciones; `addTag()` agrega una.

## 8. Hooks: acciones antes o después de operaciones

| Método del modelo | Función |
| --- | --- |
| `addHook(tipo, nombreOpcional, funcion)` | Registra una función para un evento. |
| `removeHook(tipo, nombreOReferencia)` | Quita el hook registrado. |
| `hasHook(tipo)` / `hasHooks(tipo)` | Indica si existen hooks del tipo; son alias. |
| `runHooks(tipo, ...argumentos)` | Ejecuta hooks manualmente; uso avanzado. |

```js
User.addHook('beforeCreate', 'normalizarCorreo', usuario => {
  usuario.email = usuario.email.toLowerCase();
});
// User.removeHook('beforeCreate', 'normalizarCorreo');
```

También hay atajos `Model.nombreDelHook(funcion)` o `(nombre, funcion)` para estos eventos de modelos en v6:

- Validación: `beforeValidate`, `afterValidate`, `validationFailed`.
- Escritura individual: `beforeCreate`, `afterCreate`, `beforeUpdate`, `afterUpdate`, `beforeSave`, `afterSave`, `beforeDestroy`, `afterDestroy`, `beforeRestore`, `afterRestore`.
- Escritura masiva: `beforeBulkCreate`, `afterBulkCreate`, `beforeBulkUpdate`, `afterBulkUpdate`, `beforeBulkDestroy`, `afterBulkDestroy`, `beforeBulkRestore`, `afterBulkRestore`.
- Consultas: `beforeFind`, `beforeFindAfterExpandIncludeAll`, `beforeFindAfterOptions`, `afterFind`, `beforeCount`.
- Otras operaciones: `beforeUpsert`, `afterUpsert`, `beforeSync`, `afterSync`, `beforeAssociate`, `afterAssociate`.
- La implementación también expone `beforeBulkSync`, `afterBulkSync`, `beforeQuery` y `afterQuery` en el modelo; para eventos globales de sincronización o consultas, registralos en la instancia `sequelize`, que es donde se disparan.

Las operaciones masivas no ejecutan normalmente los hooks individuales; para las que lo admiten, usá `individualHooks: true` si lo necesitás.

## 9. Métodos de una instancia

En esta tabla, `registro` es un objeto devuelto por una búsqueda, `build()` o `create()`.

| Método | Qué hace |
| --- | --- |
| `registro.get(campo)` | Lee un atributo aplicando getters; sin campo obtiene sus valores. |
| `registro.get({ plain: true })` | Obtiene un objeto simple, incluyendo relaciones cargadas. |
| `registro.set(campo, valor)` / `.set(objeto)` | Cambia valores en memoria, aplicando setters. No guarda. |
| `registro.setAttributes(objeto)` | Alias de `set`. |
| `registro.getDataValue(campo)` | Lee el valor interno sin ejecutar getters personalizados. |
| `registro.setDataValue(campo, valor)` | Modifica el valor interno sin ejecutar setters personalizados. |
| `registro.changed()` | Devuelve campos modificados o `false`; con un campo comprueba su cambio. |
| `registro.changed(campo, booleano)` | Marca manualmente si un campo cambió; útil para objetos JSON modificados internamente. |
| `registro.previous(campo)` | Obtiene el valor anterior del atributo; sin campo, valores anteriores de campos cambiados. |
| `registro.validate(opciones)` | Ejecuta validaciones sin guardar; rechaza la promesa si fallan. |
| `registro.save(opciones)` | Inserta si es nuevo o guarda cambios si ya existe; devuelve la instancia. |
| `registro.update(valores, opciones)` | Aplica y guarda los valores indicados; devuelve la instancia. |
| `registro.reload(opciones)` | Vuelve a leer el registro de la base y actualiza la instancia. |
| `registro.destroy(opciones)` | Elimina ese registro; puede ser eliminación lógica según el modelo. |
| `registro.restore(opciones)` | Restaura ese registro si el modelo es `paranoid`. |
| `registro.isSoftDeleted()` | Indica si fue eliminado lógicamente; requiere `paranoid`. |
| `registro.increment(campos, opciones)` | Incrementa columnas de ese registro; en MySQL, recargá para leer el nuevo valor. |
| `registro.decrement(campos, opciones)` | Decrementa columnas de ese registro; misma consideración. |
| `registro.equals(otraInstancia)` | Compara identidad por modelo y clave primaria, no todos los atributos. |
| `registro.equalsOneOf(instancias)` | Comprueba si representa el mismo registro que alguna instancia de la lista. |
| `registro.toJSON()` | Devuelve una representación simple serializable; no oculta automáticamente `password`. |
| `registro.where()` | Obtiene la condición de clave primaria que identifica la instancia. |
| `registro.toString()` | Devuelve una etiqueta descriptiva de la instancia; no sus datos JSON. |

```js
const usuario = await User.findByPk(1);
if (usuario) {
  usuario.set({ username: 'anaActualizada' });
  console.log(usuario.changed());
  await usuario.save();
  const { password, ...datosPublicos } = usuario.toJSON();
  // Enviar datosPublicos, evitando exponer el hash de contraseña.
}
```

## 10. Utilidades poco documentadas e internas

La implementación instalada también contiene `Model.refreshAttributes()` (recalcula metadatos), `Model.hasAlias(alias)` (comprueba una asociación), `Model.dropSchema(schema)` (delega el borrado del esquema), `Model.warnOnInvalidOptions(...)` (diagnóstico interno) e `instancia.setValidators(...)` (mecanismo antiguo para validadores). No forman parte del uso habitual de controladores y algunas no tienen contrato público estable; preferí la configuración del modelo y la API documentada.

`sequelize.define()`, `sequelize.authenticate()` y `sequelize.transaction()` pertenecen a la instancia **Sequelize**, no al modelo. `Model.sequelize`, `Model.associations` y `Model.rawAttributes` son propiedades, no métodos.

## 11. Ejemplo dentro de un controlador

```js
export const actualizarArticulo = async (req, res) => {
  try {
    const articulo = await Article.findByPk(req.params.id);
    if (!articulo) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }
    const esAutor = articulo.userId === req.authUser.id;
    const esAdmin = req.authUser.role === 'admin';
    if (!esAutor && !esAdmin) {
      return res.status(403).json({ message: 'Sin permisos' });
    }
    await articulo.update({ title: req.body.title });
    return res.json(articulo);
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar el artículo' });
  }
};
```

Este ejemplo supone que la ruta ya ejecutó autenticación y validación del título. `req.params.id` es un identificador: primero buscá la instancia con `findByPk()` para poder llamar a `.update()`.

## Referencias

- [Referencia oficial de Model en Sequelize 6](https://sequelize.org/api/v6/class/src/model.js~model).
- Implementación y tipos instalados: `node_modules/sequelize/lib/model.js`, `node_modules/sequelize/lib/hooks.js` y `node_modules/sequelize/types/model.d.ts`. Se usaron para comprobar los métodos y particularidades de la versión del proyecto.
