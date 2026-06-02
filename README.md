# Vanguardia Juridica - Legal Case Manager

Aplicacion de prueba para administrar casos de un estudio de abogados. El proyecto usa Vue, Vuetify y Vite en el frontend, y Express con Node.js en el backend.

## Requisitos

- Node.js 20 o superior
- npm

## Como levantar el proyecto

Instalar dependencias desde la raiz y desde cada aplicacion si todavia no estan instaladas:

```bash
npm install
```

Levantar frontend y backend juntos:

```bash
npm run dev
```

Tambien se pueden levantar por separado:

```bash
npm run dev:server
npm run dev:ui
```

Por defecto, la API corre en `http://localhost:3000` y la UI en `http://localhost:5173`.

## Usuarios de prueba

La contrasena de todos los usuarios es `1234`.

| Nombre | Rol |
| --- | --- |
| Alan | Abogado |
| Dario | Abogado |
| Karina | Abogado |
| Sara | Asistente |
| Miguel | Asistente |
| Roberto | Asistente |

## Reglas principales

- Los abogados ven solo los casos que poseen.
- Los abogados pueden crear casos, editar estado/asistente y borrar sus casos.
- Los abogados pueden asignar como maximo un asistente por caso.
- Los asistentes ven solo los casos asignados a ellos.
- Los asistentes no pueden crear, editar ni borrar casos.
- Los datos son iniciales y viven en memoria; no hay persistencia.

## API

- `POST /api/auth/login`: recibe `name`, `password` y opcionalmente `remember`; devuelve un JWT.
- `GET /api/cases`: lista los casos visibles para el usuario autenticado.
- `POST /api/cases`: crea un caso, solo abogados.
- `PATCH /api/cases/:id`: edita `status` o `assistantId`, solo el abogado dueno.
- `DELETE /api/cases/:id`: borra un caso, solo el abogado dueno.
- `GET /api/users/assistants`: lista asistentes, solo abogados.

El token debe enviarse en `Authorization: Bearer <token>`.

## Tests

```bash
npm test
```

Los tests cubren login, remember me, filtrado por rol, permisos de gestion, errores HTTP y listado de asistentes.
