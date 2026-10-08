# Sequelize v6 — Propiedades de un Model

> Guía de referencia para las propiedades configurables al definir modelos con `sequelize.define()` o `Model.init()`.

## 1. Estructura básica

```js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Usuario = sequelize.define(
  "Usuario",
  {
    // ATRIBUTOS / COLUMNAS
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // OPCIONES DEL MODELO
    tableName: "usuarios",
    timestamps: true,
  }
);

export default Usuario;
```

La estructura general es:

```js
sequelize.define(
  "NombreDelModelo",
  {
    // definición de columnas
  },
  {
    // configuración general del modelo
  }
);
```

---

# 2. Propiedades de una columna

Ejemplo completo:

```js
campo: {
  type: DataTypes.STRING,
  allowNull: false,
  defaultValue: "valor",
  unique: true,
  primaryKey: false,
  autoIncrement: false,
  field: "nombre_en_bd",
  comment: "Descripción de la columna",
  validate: {},
}
```

## `type`

Define el tipo de dato.

```js
nombre: {
  type: DataTypes.STRING
}
```

Tipos comunes:

```js
DataTypes.STRING
DataTypes.STRING(100)
DataTypes.TEXT
DataTypes.INTEGER
DataTypes.BIGINT
DataTypes.FLOAT
DataTypes.DOUBLE
DataTypes.DECIMAL
DataTypes.BOOLEAN
DataTypes.DATE
DataTypes.DATEONLY
DataTypes.TIME
DataTypes.UUID
DataTypes.UUIDV4
DataTypes.JSON
DataTypes.JSONB
DataTypes.ENUM
DataTypes.ARRAY
DataTypes.BLOB
```

Ejemplo:

```js
precio: {
  type: DataTypes.DECIMAL(10, 2)
}
```

---

## `allowNull`

Indica si acepta `NULL`.

```js
nombre: {
  type: DataTypes.STRING,
  allowNull: false
}
```

Equivale aproximadamente a:

```sql
nombre VARCHAR(...) NOT NULL
```

Por defecto:

```js
allowNull: true
```

---

## `defaultValue`

Valor por defecto.

```js
activo: {
  type: DataTypes.BOOLEAN,
  defaultValue: true
}
```

También:

```js
creadoEn: {
  type: DataTypes.DATE,
  defaultValue: DataTypes.NOW
}
```

---

## `unique`

Crea una restricción `UNIQUE`.

```js
email: {
  type: DataTypes.STRING,
  unique: true
}
```

También puede utilizarse para una restricción única compuesta:

```js
nombre: {
  type: DataTypes.STRING,
  unique: "usuario_empresa"
},

empresaId: {
  type: DataTypes.INTEGER,
  unique: "usuario_empresa"
}
```

En ese caso la combinación:

```text
nombre + empresaId
```

debe ser única.

---

## `primaryKey`

Marca la columna como clave primaria.

```js
id: {
  type: DataTypes.INTEGER,
  primaryKey: true
}
```

---

## `autoIncrement`

Incrementa automáticamente un campo numérico.

```js
id: {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true
}
```

---

## `autoIncrementIdentity`

Opción específica de PostgreSQL 10+.

```js
id: {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true,
  autoIncrementIdentity: true
}
```

Hace que PostgreSQL utilice una columna `IDENTITY` en lugar del mecanismo clásico basado en `SERIAL`.

---

## `field`

Permite que el atributo en JavaScript tenga un nombre distinto al de la columna SQL.

```js
firstName: {
  type: DataTypes.STRING,
  field: "first_name"
}
```

En JavaScript:

```js
usuario.firstName
```

En PostgreSQL/MySQL:

```sql
first_name
```

---

## `comment`

Agrega un comentario a la columna cuando el dialecto lo soporta.

```js
edad: {
  type: DataTypes.INTEGER,
  comment: "Edad actual del usuario"
}
```

---

# 3. Foreign Keys con `references`

Podés definir una referencia explícita:

```js
usuarioId: {
  type: DataTypes.INTEGER,

  references: {
    model: Usuario,
    key: "id"
  }
}
```

También puede utilizarse el nombre de la tabla/modelo según el caso:

```js
references: {
  model: "usuarios",
  key: "id"
}
```

## `references.model`

Tabla o modelo referenciado.

```js
references: {
  model: Usuario
}
```

## `references.key`

Columna referenciada.

```js
references: {
  model: Usuario,
  key: "id"
}
```

Por defecto normalmente se utiliza:

```text
id
```

---

## `onDelete`

Define qué ocurre cuando se elimina el registro referenciado.

```js
usuarioId: {
  type: DataTypes.INTEGER,

  references: {
    model: Usuario,
    key: "id"
  },

  onDelete: "CASCADE"
}
```

Valores habituales:

```text
CASCADE
RESTRICT
SET NULL
SET DEFAULT
NO ACTION
```

---

## `onUpdate`

Define qué ocurre si cambia la clave referenciada.

```js
onUpdate: "CASCADE"
```

Valores habituales:

```text
CASCADE
RESTRICT
SET NULL
SET DEFAULT
NO ACTION
```

---

# 4. `validate`

Permite validar el valor antes de guardar.

```js
email: {
  type: DataTypes.STRING,

  validate: {
    isEmail: true
  }
}
```

Ejemplo:

```js
edad: {
  type: DataTypes.INTEGER,

  validate: {
    min: 18,
    max: 100
  }
}
```

Validaciones comunes:

```js
validate: {
  isEmail: true,
  isUrl: true,
  isIP: true,
  isAlpha: true,
  isAlphanumeric: true,
  isNumeric: true,
  isInt: true,
  isFloat: true,
  isDecimal: true,
  isLowercase: true,
  isUppercase: true,
  notEmpty: true,
  len: [3, 50],
  min: 0,
  max: 100,
  isIn: [["admin", "user", "moderator"]],
  notIn: [["bloqueado"]],
}
```

Ejemplo:

```js
rol: {
  type: DataTypes.STRING,

  validate: {
    isIn: [["admin", "usuario", "empleado"]]
  }
}
```

---

# 5. Validación personalizada

Podés crear tu propia función.

```js
edad: {
  type: DataTypes.INTEGER,

  validate: {
    mayorDeEdad(value) {
      if (value < 18) {
        throw new Error("Debe ser mayor de edad");
      }
    }
  }
}
```

---

# 6. Mensajes personalizados

```js
email: {
  type: DataTypes.STRING,

  allowNull: false,

  validate: {
    notNull: {
      msg: "El email es obligatorio"
    },

    isEmail: {
      msg: "El email no es válido"
    }
  }
}
```

---

# 7. `get()`

Permite transformar un dato al leerlo.

```js
nombre: {
  type: DataTypes.STRING,

  get() {
    const valor = this.getDataValue("nombre");

    return valor?.toUpperCase();
  }
}
```

Si en la base está:

```text
gaston
```

al consultar podrías recibir:

```text
GASTON
```

---

# 8. `set()`

Permite transformar un dato antes de guardarlo.

```js
email: {
  type: DataTypes.STRING,

  set(value) {
    this.setDataValue(
      "email",
      value.toLowerCase()
    );
  }
}
```

Si recibís:

```text
GASTON@EMAIL.COM
```

se guarda como:

```text
gaston@email.com
```

---

# 9. Atributos virtuales

Un atributo virtual existe en Sequelize pero no como columna física.

```js
nombreCompleto: {
  type: DataTypes.VIRTUAL,

  get() {
    return `${this.nombre} ${this.apellido}`;
  }
}
```

---

# 10. Opciones generales del modelo

Estas propiedades van en el tercer argumento de `sequelize.define()`:

```js
const Usuario = sequelize.define(
  "Usuario",
  {
    // columnas
  },
  {
    // opciones del modelo
  }
);
```

---

## `tableName`

Define manualmente el nombre de la tabla.

```js
{
  tableName: "usuarios"
}
```

---

## `modelName`

Principalmente utilizado con `Model.init()`.

```js
Usuario.init(
  {
    // columnas
  },
  {
    sequelize,
    modelName: "Usuario"
  }
);
```

---

## `sequelize`

Con `Model.init()` indica qué instancia de Sequelize utiliza el modelo.

```js
{
  sequelize
}
```

---

## `timestamps`

Por defecto:

```js
timestamps: true
```

Sequelize agrega:

```text
createdAt
updatedAt
```

Para desactivarlos:

```js
{
  timestamps: false
}
```

---

## `createdAt`

Permite cambiar el nombre o desactivar `createdAt`.

```js
{
  timestamps: true,
  createdAt: "created_at"
}
```

Desactivarlo:

```js
{
  createdAt: false
}
```

---

## `updatedAt`

Cambiar nombre:

```js
{
  updatedAt: "updated_at"
}
```

Desactivar:

```js
{
  updatedAt: false
}
```

---

## `deletedAt`

Se usa normalmente junto con:

```js
paranoid: true
```

Ejemplo:

```js
{
  timestamps: true,
  paranoid: true,
  deletedAt: "deleted_at"
}
```

---

# 11. `paranoid`

Activa el **soft delete**.

```js
{
  paranoid: true
}
```

En vez de ejecutar conceptualmente:

```sql
DELETE FROM usuarios;
```

Sequelize establece una fecha en:

```text
deletedAt
```

El registro continúa existiendo físicamente.

Para que funcione necesita:

```js
timestamps: true
```

---

# 12. `freezeTableName`

Sequelize normalmente pluraliza el nombre del modelo.

```text
User
↓
Users
```

Con:

```js
{
  freezeTableName: true
}
```

mantiene el nombre sin pluralizar.

---

# 13. `underscored`

Convierte los nombres físicos generados a `snake_case`.

```js
{
  underscored: true
}
```

Por ejemplo:

```text
createdAt
```

se mapea a:

```text
created_at
```

Y una FK como:

```text
userId
```

se mapea a:

```text
user_id
```

El atributo en JavaScript puede continuar siendo `camelCase`.

---

# 14. `schema`

Especialmente útil con PostgreSQL.

```js
{
  schema: "public"
}
```

Ejemplo:

```js
{
  schema: "administracion",
  tableName: "usuarios"
}
```

Resultado conceptual:

```text
administracion.usuarios
```

---

# 15. `defaultScope`

Define filtros/opciones utilizados automáticamente en consultas.

```js
{
  defaultScope: {
    where: {
      activo: true
    }
  }
}
```

Entonces:

```js
Usuario.findAll();
```

aplicará ese scope por defecto.

---

# 16. `scopes`

Permite crear consultas reutilizables.

```js
{
  scopes: {
    activos: {
      where: {
        activo: true
      }
    },

    administradores: {
      where: {
        rol: "admin"
      }
    }
  }
}
```

Uso:

```js
Usuario.scope("activos").findAll();
```

---

# 17. `omitNull`

Evita persistir valores `null`.

```js
{
  omitNull: true
}
```

---

# 18. `name`

Permite definir explícitamente nombre singular y plural del modelo para asociaciones.

```js
{
  name: {
    singular: "usuario",
    plural: "usuarios"
  }
}
```

---

# 19. `indexes`

Define índices.

```js
{
  indexes: [
    {
      fields: ["email"]
    }
  ]
}
```

Índice único:

```js
{
  indexes: [
    {
      unique: true,
      fields: ["email"]
    }
  ]
}
```

Índice compuesto:

```js
{
  indexes: [
    {
      fields: [
        "nombre",
        "apellido"
      ]
    }
  ]
}
```

---

## Propiedades importantes de un índice

```js
{
  indexes: [
    {
      name: "idx_usuario_email",
      unique: true,
      using: "BTREE",
      fields: ["email"]
    }
  ]
}
```

Propiedades disponibles más importantes:

```text
name
type
using
operator
unique
concurrently
fields
```

### `name`

```js
name: "idx_usuario_email"
```

### `unique`

```js
unique: true
```

### `using`

Método del índice, dependiendo del motor.

```js
using: "BTREE"
```

En PostgreSQL también pueden aparecer, según el caso:

```text
GIN
GIST
HASH
BTREE
```

### `concurrently`

PostgreSQL:

```js
concurrently: true
```

Permite construir el índice reduciendo el bloqueo de escrituras.

### `fields`

```js
fields: ["email"]
```

También puede tener configuración por campo:

```js
fields: [
  {
    attribute: "nombre",
    order: "ASC"
  }
]
```

---

# 20. `hooks`

Permite ejecutar código durante el ciclo de vida del modelo.

```js
{
  hooks: {
    beforeCreate(usuario) {
      console.log("Antes de crear");
    },

    afterCreate(usuario) {
      console.log("Después de crear");
    }
  }
}
```

Hooks comunes:

```text
beforeValidate
afterValidate
validationFailed

beforeCreate
afterCreate

beforeUpdate
afterUpdate

beforeSave
afterSave

beforeDestroy
afterDestroy

beforeBulkCreate
afterBulkCreate

beforeBulkUpdate
afterBulkUpdate

beforeBulkDestroy
afterBulkDestroy
```

---

# 21. Validaciones a nivel de modelo

Además de validar una columna, podés validar varios campos juntos.

```js
{
  validate: {
    fechasValidas() {
      if (this.fechaInicio > this.fechaFin) {
        throw new Error(
          "fechaInicio no puede ser posterior a fechaFin"
        );
      }
    }
  }
}
```

---

# 22. `engine`

Permite indicar el motor de almacenamiento cuando el dialecto lo soporta.

```js
{
  engine: "InnoDB"
}
```

Especialmente relacionado con MySQL/MariaDB.

---

# 23. `charset`

Define el charset de la tabla cuando el dialecto lo soporta.

```js
{
  charset: "utf8mb4"
}
```

---

# 24. `collate`

Define la collation.

```js
{
  collate: "utf8mb4_unicode_ci"
}
```

---

# 25. `comment`

Comentario general de la tabla.

```js
{
  comment: "Tabla de usuarios"
}
```

No confundir con el `comment` de una columna.

---

# 26. `initialAutoIncrement`

Permite configurar el valor inicial de `AUTO_INCREMENT` en MySQL.

```js
{
  initialAutoIncrement: "1000"
}
```

---

# 27. `whereMergeStrategy`

Controla cómo se combinan condiciones `where` al combinar scopes.

Valores:

```text
overwrite
and
```

Ejemplo:

```js
{
  whereMergeStrategy: "and"
}
```

---

# 28. Ejemplo completo

```js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Usuario = sequelize.define(
  "Usuario",

  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,

      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,

      validate: {
        isEmail: true
      },

      set(value) {
        this.setDataValue(
          "email",
          value.toLowerCase()
        );
      }
    },

    edad: {
      type: DataTypes.INTEGER,

      validate: {
        min: 0,
        max: 120
      }
    },

    rol: {
      type: DataTypes.ENUM(
        "admin",
        "usuario",
        "empleado"
      ),

      allowNull: false,

      defaultValue: "usuario"
    },

    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },

    empresaId: {
      type: DataTypes.INTEGER,

      references: {
        model: "empresas",
        key: "id"
      },

      onUpdate: "CASCADE",
      onDelete: "SET NULL"
    }
  },

  {
    tableName: "usuarios",

    timestamps: true,

    createdAt: "created_at",
    updatedAt: "updated_at",

    paranoid: true,
    deletedAt: "deleted_at",

    underscored: true,

    indexes: [
      {
        unique: true,
        fields: ["email"]
      },

      {
        fields: ["empresa_id"]
      }
    ],

    hooks: {
      beforeCreate(usuario) {
        console.log(
          "Creando usuario:",
          usuario.email
        );
      }
    }
  }
);

export default Usuario;
```

---

# 29. Lo fundamental para memorizar

Para la mayoría de proyectos vas a utilizar principalmente:

```js
campo: {
  type: DataTypes.STRING,
  allowNull: false,
  unique: true,
  defaultValue: "...",
  primaryKey: true,
  autoIncrement: true,
  validate: {}
}
```

Y a nivel del modelo:

```js
{
  tableName: "...",
  timestamps: true,
  paranoid: true,
  underscored: true
}
```

La estructura mental es:

```text
MODEL
│
├── ATRIBUTOS
│   ├── type
│   ├── allowNull
│   ├── defaultValue
│   ├── unique
│   ├── primaryKey
│   ├── autoIncrement
│   ├── field
│   ├── references
│   ├── onDelete
│   ├── onUpdate
│   ├── validate
│   ├── get
│   └── set
│
└── OPCIONES DEL MODELO
    ├── tableName
    ├── modelName
    ├── timestamps
    ├── createdAt
    ├── updatedAt
    ├── paranoid
    ├── deletedAt
    ├── underscored
    ├── freezeTableName
    ├── schema
    ├── scopes
    ├── defaultScope
    ├── indexes
    ├── hooks
    └── validate
```

---

# 30. Chuleta mínima

```js
const Modelo = sequelize.define(
  "Modelo",

  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    campo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      defaultValue: "valor",

      validate: {
        notEmpty: true
      }
    }
  },

  {
    tableName: "tabla",
    timestamps: true,
    paranoid: false,
    underscored: true
  }
);
```

---

## Nota

Esta guía cubre las propiedades configurables más importantes y documentadas para la **definición de modelos en Sequelize v6 estable**, incluyendo opciones de atributos, opciones generales, índices, validaciones, getters/setters y hooks. No pretende listar propiedades internas privadas de la clase `Model` que Sequelize utiliza internamente.

Fuentes consultadas: documentación oficial de Sequelize v6 — Model Basics, Model API, Validations & Constraints, Indexes, Hooks y Naming Strategies.
