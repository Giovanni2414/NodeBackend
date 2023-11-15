# Node.js TypeScript Backend with MongoDB

Este es un proyecto de backend desarrollado con Node.js, TypeScript y MongoDB. La aplicación permite realizar operaciones CRUD en usuarios y grupos, manejar la autenticación de usuarios y asociar usuarios a grupos.

## Configuración

### 1. Instalación de Dependencias

Asegúrate de tener [Node.js](https://nodejs.org/) y [npm](https://www.npmjs.com/) instalados en tu máquina.

# Clona el repositorio
`git clone https://https://github.com/Giovanni2414/NodeBackend.git`

# Navega al directorio del proyecto
`cd node-backend`

# Instala las dependencias
`npm install`

### 2. Configuración de MongoDB
Asegúrate de tener un servidor MongoDB en ejecución o configura una instancia en la nube.

MongoDB Atlas es una opción conveniente para configurar una base de datos en la nube.
Crea un archivo .env en la raíz del proyecto y agrega la URL de conexión a tu base de datos MongoDB:

`MONGODB_URI=<uri_connection>`
`MONGODB_DB=<database>`

El servidor estará en ejecución en http://localhost:3000.

`npm run start`

### Uso
#### Operaciones CRUD de Usuarios:

* Crear usuario: POST /api/users
* Obtener todos los usuarios: GET /api/users
* Obtener un usuario por ID: GET /api/users/:userId
* Actualizar usuario por ID: PUT /api/users/:userId
* Eliminar usuario por ID: DELETE /api/users/:userId

#### Operaciones CRUD de Grupos:

* Crear grupo: POST /api/groups
* Obtener todos los grupos: GET /api/groups
* Obtener un grupo por ID: GET /api/groups/:groupId
* Actualizar grupo por ID: PUT /api/groups/:groupId
* Eliminar grupo por ID: DELETE /api/groups/:groupId

#### Operaciones de Autenticación y Asociación:

* Crear sesión (login): POST /api/auth/login
* Asociar usuario a un grupo: POST /api/groups/:groupId/users/:userId
* Desasociar usuario de un grupo: DELETE /api/groups/:groupId/users/:userId
* Obtener grupos asociados a un usuario: GET /api/groups/user/:userId/groups

### Contribuir
Si deseas contribuir a este proyecto, sigue estos pasos:

Crea una rama (git checkout -b feature/nueva-caracteristica)
Realiza cambios y haz commit (git commit -am 'Agrega nueva característica')
Sube los cambios (git push origin feature/nueva-caracteristica)
Abre un pull request
