# Sistema de Gestión de Turnos

Aplicación web para gestionar turnos de manera sencilla, organizada y accesible desde una computadora o un celular.

El proyecto surge de una necesidad real: centralizar la información de los clientes y sus turnos, facilitando su administración y la comunicación mediante mensajes de WhatsApp.

## 🎯 Objetivo

Desarrollar una aplicación full stack que permita registrar clientes, administrar turnos y generar mensajes personalizados para copiar y enviar manualmente por WhatsApp.

El proyecto también tiene como objetivo reforzar conocimientos de desarrollo backend, diseño de APIs REST, bases de datos relacionales e integración entre frontend y backend.

## 🛠️ Tecnologías

### Backend
- **Node.js:** entorno de ejecución de JavaScript.
- **Express:** framework para desarrollar la API REST.
- **PostgreSQL:** base de datos relacional para almacenar clientes y turnos.
- **SQL:** consultas y operaciones sobre la base de datos.

### Frontend
- **React:** biblioteca para construir la interfaz de usuario.
- **Vite:** herramienta de desarrollo y compilación.
- **CSS:** diseño y estilos de la interfaz.

### Herramientas
- **Git y GitHub:** control de versiones y alojamiento del código.
- **Postman o Bruno:** pruebas de los endpoints de la API.
- **Netlify:** despliegue del frontend.
- **Vercel:** despliegue del backend, sujeto a las condiciones del plan elegido.

## ✨ Funcionalidades previstas

- Registro y administración de clientes.
- Creación, edición y cancelación de turnos.
- Gestión de fechas, horarios y duración de los turnos.
- Consulta de la agenda y búsqueda de turnos.
- Control de posibles superposiciones horarias.
- Generación de mensajes personalizados con los datos de cada turno.
- Copia de mensajes para enviarlos manualmente por WhatsApp.
- Interfaz responsive, adaptable a celulares y computadoras.
- Persistencia de los datos mediante PostgreSQL.

## 🏗️ Arquitectura

El proyecto estará dividido en dos partes principales:

- `backend/`: API REST desarrollada con Node.js y Express, responsable de la lógica de negocio y del acceso a la base de datos.
- `frontend/`: interfaz desarrollada con React, responsable de la interacción con el usuario.

El frontend se comunicará con el backend mediante solicitudes HTTP e intercambio de datos en formato JSON. PostgreSQL será la fuente de persistencia de la aplicación.

## 📁 Estructura del proyecto

```text
sistema-turnos/
├── backend/
│   └── src/
│       └── index.js
├── frontend/
├── .gitignore
└── README.md
```

La estructura se irá ampliando a medida que se incorporen las rutas, los controladores, la configuración de la base de datos y los componentes de la interfaz.

## 🚀 Plan de desarrollo

1. Definir el modelo de datos y las reglas de negocio.
2. Diseñar los endpoints de la API REST.
3. Configurar Express y PostgreSQL.
4. Implementar y probar las operaciones del backend.
5. Desarrollar la interfaz con React.
6. Integrar el frontend con la API.
7. Implementar la generación y copia de mensajes para WhatsApp.
8. Realizar pruebas y publicar la aplicación.

## 📌 Estado del proyecto

**En desarrollo.**

Actualmente se está preparando la estructura inicial del backend y definiendo la arquitectura de la aplicación.

---

Proyecto personal desarrollado con fines prácticos y educativos, orientado a resolver una necesidad real mediante herramientas de desarrollo web full stack.
