# Sistema de Turnos --- Backend

API REST para gestionar clientes y turnos. Está desarrollada con Node.js
y Express, utiliza PostgreSQL mediante `pg` y se encuentra desplegada en
Vercel, con la base de datos alojada en Neon.

-   **Repositorio:**
    [EzequiasHerrera/sistema-turnos](https://github.com/EzequiasHerrera/sistema-turnos)
-   **URL base de producción:** https://sistema-turnos-seven.vercel.app

## Tecnologías

-   **Node.js** --- entorno de ejecución.
-   **Express 5** --- servidor y enrutamiento HTTP.
-   **PostgreSQL** --- base de datos relacional.
-   **node-postgres (`pg`)** --- conexión y consultas SQL.
-   **dotenv** --- carga de variables de entorno.
-   **Neon** --- PostgreSQL administrado en la nube.
-   **Vercel** --- despliegue del backend.

El proyecto utiliza módulos ES de JavaScript (`"type": "module"`).

## Estructura del proyecto

Estructura informada para `src/`:

``` text
backend/
└── src/
    ├── config/
    ├── controllers/
    ├── middlewares/
    ├── routes/
    ├── services/
    └── index.js
```

-   `config/`: configuración, incluida la conexión a la base de datos.
-   `controllers/`: lógica que atiende las operaciones de clientes y
    turnos.
-   `routes/`: definición de rutas HTTP.
-   `middlewares/`: directorio existente, actualmente sin archivos.
-   `services/`: directorio existente, actualmente sin archivos.
-   `index.js`: punto de entrada de la aplicación.

## Modelo de datos

La base de datos PostgreSQL contiene las tablas `clients` y
`appointments`.

### Tabla `clients`

  -------------------------------------------------------------------------------
  Columna                 Tipo                            Descripción
  ----------------------- ------------------------------- -----------------------
  `id`                    `INTEGER`                       Clave primaria
                                                          autogenerada.

  `name`                  `VARCHAR`                       Nombre del cliente;
                                                          obligatorio.

  `phone`                 `VARCHAR`                       Teléfono del cliente;
                                                          obligatorio.

  `is_active`             `BOOLEAN`                       Estado del cliente; por
                                                          defecto `true`.

  `created_at`            `TIMESTAMP WITHOUT TIME ZONE`   Fecha de creación; por
                                                          defecto
                                                          `CURRENT_TIMESTAMP`.
  -------------------------------------------------------------------------------

### Tabla `appointments`

  Columna        Tipo                            Descripción
  -------------- ------------------------------- ------------------------------
  `id`           `INTEGER`                       Clave primaria autogenerada.
  `client_id`    `INTEGER`                       Referencia a `clients.id`.
  `start_time`   `TIMESTAMP WITHOUT TIME ZONE`   Inicio del turno.
  `end_time`     `TIMESTAMP WITHOUT TIME ZONE`   Fin del turno.
  `status`       `VARCHAR`                       Estado del turno.
  `notes`        `TEXT`                          Notas adicionales.
  `created_at`   `TIMESTAMP WITHOUT TIME ZONE`   Fecha de creación.

La tabla `appointments` está relacionada con `clients` mediante una
clave foránea. La eliminación de un cliente referenciado por un turno
está restringida.

### Restricciones de la base de datos

-   Los estados de turno permitidos son `scheduled`, `completed` y
    `cancelled`.
-   `end_time` debe ser posterior a `start_time`.
-   No se permiten turnos superpuestos cuando su estado no es
    `cancelled`.
-   Los intervalos se evalúan como `[inicio, fin)`, por lo que dos
    turnos pueden ser consecutivos si uno termina exactamente cuando
    empieza el siguiente.
-   Los identificadores de ambas tablas se generan automáticamente.

Estas restricciones protegen la integridad de los datos en PostgreSQL,
además de cualquier validación que realicen los controladores.

## Endpoints

Todos los endpoints de esta sección usan la URL base:

``` text
https://sistema-turnos-seven.vercel.app
```

### Clientes

Prefijo: `/api/clients`

  ---------------------------------------------------------------------------
  Método                  Endpoint                    Operación
  ----------------------- --------------------------- -----------------------
  `GET`                   `/api/clients`              Obtener la lista de
                                                      clientes.

  `GET`                   `/api/clients/:id`          Obtener un cliente por
                                                      ID.

  `POST`                  `/api/clients`              Crear un cliente.

  `PUT`                   `/api/clients/:id`          Actualizar un cliente.

  `PATCH`                 `/api/clients/:id/status`   Cambiar el estado
                                                      activo/inactivo de un
                                                      cliente.
  ---------------------------------------------------------------------------

### Turnos

Prefijo: `/api/appointments`

  --------------------------------------------------------------------------------
  Método                  Endpoint                         Operación
  ----------------------- -------------------------------- -----------------------
  `GET`                   `/api/appointments`              Obtener la lista de
                                                           turnos.

  `GET`                   `/api/appointments/:id`          Obtener un turno por
                                                           ID.

  `POST`                  `/api/appointments`              Crear un turno.

  `PUT`                   `/api/appointments/:id`          Actualizar un turno.

  `PATCH`                 `/api/appointments/:id/status`   Actualizar el estado de
                                                           un turno.
  --------------------------------------------------------------------------------

`PATCH` se utiliza para las operaciones específicas de estado. Los
campos aceptados, validaciones y códigos HTTP dependen de la
implementación de los controladores.

## Ejemplos de uso con Postman

En Postman, seleccioná el método HTTP indicado, ingresá la URL completa
y, para peticiones con cuerpo JSON, seleccioná **Body → raw → JSON** y
enviá el encabezado `Content-Type: application/json`.

### Listar clientes

``` http
GET https://sistema-turnos-seven.vercel.app/api/clients
```

### Crear un cliente

``` http
POST https://sistema-turnos-seven.vercel.app/api/clients
Content-Type: application/json
```

``` json
{
  "name": "Cliente de prueba",
  "phone": "099123456"
}
```

El ejemplo utiliza los campos de cliente confirmados. El ID se genera
automáticamente y `is_active` tiene valor predeterminado `true`.

### Consultar turnos

``` http
GET https://sistema-turnos-seven.vercel.app/api/appointments
```

### Consultar un recurso por ID

Reemplazá `1` por el identificador que quieras consultar:

``` http
GET https://sistema-turnos-seven.vercel.app/api/clients/1
```

``` http
GET https://sistema-turnos-seven.vercel.app/api/appointments/1
```

### Crear o actualizar turnos

La tabla `appointments` contiene `client_id`, `start_time`, `end_time`,
`status` y `notes`, además de `id` y `created_at`. El cuerpo exacto
aceptado para `POST` y `PUT` debe confirmarse en
`appointmentController.js`; no se documenta aquí un payload como
contrato definitivo sin revisar ese controlador.

## Configuración local

### Requisitos

-   Node.js y npm.
-   Una instancia PostgreSQL accesible.
-   La cadena de conexión de la base de datos.

### 1. Clonar el repositorio

``` bash
git clone https://github.com/EzequiasHerrera/sistema-turnos.git
cd sistema-turnos/backend
```

### 2. Instalar dependencias

``` bash
npm install
```

### 3. Configurar variables de entorno

Creá un archivo `.env` en el directorio `backend/`:

``` env
DATABASE_URL=postgresql://usuario:contraseña@host/base_de_datos?sslmode=require
```

Usá la cadena de conexión correspondiente a tu instancia PostgreSQL. No
publiques credenciales ni subas el archivo `.env` al repositorio.

### 4. Iniciar el backend

El script definido en `package.json` es:

``` bash
npm start
```

Esto ejecuta `node src/index.js`. El puerto y cualquier configuración
adicional dependen del código de entrada.

## Despliegue

El backend está desplegado en Vercel y utiliza Neon como base de datos
PostgreSQL.

-   La variable `DATABASE_URL` debe estar configurada en las variables
    de entorno de Vercel.
-   Después de modificar el código, se debe comprobar el resultado del
    despliegue.
-   Las peticiones deben dirigirse a la URL base de producción indicada
    en este README.
-   Si aparece `401 Protected deployment`, revisá **Settings →
    Deployment Protection** en Vercel: la protección de despliegue puede
    impedir que herramientas como Postman accedan a la API.

No desactives la protección en un entorno con datos sensibles sin
evaluar las implicaciones de seguridad.

## Seguridad y buenas prácticas

-   Mantener las credenciales fuera del código y del repositorio.
-   No compartir públicamente `DATABASE_URL`.
-   Validar los datos recibidos por los endpoints.
-   Conservar las restricciones de PostgreSQL para proteger la
    integridad de turnos y clientes.
-   Configurar la protección de Vercel de acuerdo con el uso previsto
    del despliegue.

## Estado actual

-   [x] API desplegada en Vercel.
-   [x] PostgreSQL en Neon.
-   [x] Tablas `clients` y `appointments`.
-   [x] IDs autogenerados.
-   [x] Relación entre turnos y clientes.
-   [x] Restricciones de estado, horario y superposición de turnos.
-   [x] Endpoints de clientes y turnos definidos en rutas.
-   [x] Creación de clientes comprobada desde Postman.

## Autor

Proyecto desarrollado por [Ezequias
Herrera](https://github.com/EzequiasHerrera) para practicar el
desarrollo y despliegue de una API REST con Node.js, Express y
PostgreSQL.
