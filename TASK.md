# Ejercicio: Estudio de Abogados

Implementar un sistema para administrar los casos del estudio de abogados **"Vanguardia Jurídica"**.

## Descripción general

Hay dos tipos de usuarios en el sistema:

- **Abogados**
- **Asistentes**

Cada abogado dará de alta sus casos, es decir, será el **dueño** de esos casos, y tendrá la capacidad de otorgar permisos de acceso a un asistente, solo a uno por simplicidad.

## Reglas de negocio

### Abogados

El dueño tiene acceso total a sus casos y es el único que puede:

- Dar permisos sobre sus casos.
- Borrar casos.
- Editar casos.
- Agregar nuevos casos.

### Asistentes

Los asistentes solo pueden ver los casos que tienen asignados, pero no pueden editarlos.

---

# Lo solicitado

Un sitio web que tenga las siguientes funcionalidades.

## Página de Login

Formulario de login que contenga:

- Nombre
- Contraseña

La contraseña siempre será:

```text
1234
```

## Página de Dashboard

Contiene una tabla con los casos del usuario.

### Abogados

Los abogados verán:

- Sus casos.
- Controles de edición.
- Controles de borrado.
- Opción para agregar nuevos casos.

### Asistentes

Los asistentes solo verán los casos donde están asignados.

## Formulario de agregar

Puede ser:

- Un diálogo sobre el mismo listado.
- Una página aparte.

## Formulario de edición

Solo se puede editar:

- El estado.
- El asistente.

## Borrar caso

Debe permitir borrar un caso con confirmación previa.

## Remember Me

Hacer que el token se almacene para no tener que loguearse de nuevo.

## Logout

Agregar un botón para cerrar la sesión.

## Tecnologías sugeridas para el sitio web

Para el sitio web utilizar:

- **Vue**
- **Vuetify**, en lo posible

Para levantar el sitio se puede utilizar **Vite** directamente.

---

# Servicios backend

Los servicios darán soporte al sitio web.

Utilizar:

- **Express**
- **Node.js**

## Login

Recibe el usuario y la contraseña.

```json
{
  "username": "string",
  "password": "string"
}
```

Debe generar un **JWT** que contenga claims con:

- Rol del usuario.
- ID del usuario.

Este token hay que enviarlo a los otros servicios.

## Listar casos

Debe listar los casos asignados al usuario.

## Agregar caso

Debe agregar un caso nuevo y validar el token.

## Editar caso

Debe permitir editar:

- El estado.
- El asistente.

Se puede dividir en dos servicios si se prefiere.

## Borrar caso

Debe borrar el caso del listado.

## Errores HTTP

Devolver errores HTTP adecuados.

Por ejemplo:

| Situación | Código HTTP |
|---|---|
| Usuario sin permisos de edición | `403 Forbidden` |
| Caso inexistente | `404 Not Found` |
| Token inválido o ausente | `401 Unauthorized` |
| Datos inválidos | `400 Bad Request` |

---

# Datos para el ejemplo

## Importante

**No implementar persistencia.**

Estos datos de ejemplo serán los datos iniciales. Se pueden hardcodear y cargar en memoria cuando inicie el servidor.

Se puede abstraer en una clase genérica `Database` que tenga métodos que ejecuten las consultas ficticias sobre los datos en memoria.

## Usuarios

### Abogados

- Alan
- Dario
- Karina

### Asistentes

- Sara
- Miguel
- Roberto

## Casos

El listado de casos de ejemplo está adjunto como un archivo Excel.