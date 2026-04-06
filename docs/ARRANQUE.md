# Documento de Arranque Cody Sales Tracker


## Entregables
- Módulo de seguimiento de Objetivos de Ventas
- Objetivos:
    - Registrar ventas
    - Visualizar progreso
    - Desbloquear hitos (logros)
- Componentes:
    - API
    - Frontend APP

### Bonus (no requeridos originalmente)
- Autenticación
- Localización
- Color Themes


## Entidades
- Usuario (promotor)
- Metas con diferentes tipo de unidad (goals)
- Ventas
- Logros (hitos)
- Usuario (supervisor) no implementado en esta versión demo

Relación: 
- Un promotor puede tener múltiples metas tanto activas como pasadas.
- Un promotor puede tener múltiples logros
- Una meta está conformada por múltiples ventas
- Las ventas junto con un conjunto de reglas alcanzan hitos


## Stack elegido

### Backend
- **Runtime:** Node.js
- **Framework:** Express 5
- **Lenguaje:** TypeScript
- **Base de datos:** SQLite
- **Autenticación:** JWT
- **Validación:** Zod

### Frontend
- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Estado global:** Redux Toolkit
- **Ruteo:** React Router DOM v6
- **Estilos:** Tailwind CSS v3
- **HTTP:** Axios
- **Localización:** i18next (inglés y español)

### Justificación
El stack elegido para el frontend se eligió basado en mi experiencia previa, la mayoría de las web app en las que he trabajado han sido desarrolladas utilizando React con TS y Redux.

Backend, tengo más experiencia trabajando con APIs .NET, sin embargo quise simular "estar en un escenario nuevo, donde tengo que trabajar con un stack ajeno", por lo que elegí Express con Node, pero con arquitectura REST que es algo que me es familiar. Elegí Express por ser "lightweight", no es necesario tener configuración robusta para poder inicializarla, y puede ser escalada, por último tiene una gran comunidad y está bien documentada, lo que facilita su trabajo con IA.


## Arquitectura

## Implementación

La solución se divide en dos componentes: una **API REST** construida con Express + Node.js y una **aplicación frontend** en React. Ambos se comunican mediante JWT para autenticar al promotor y garantizar que cada operación esté asociada al usuario correcto.

**Registrar ventas** se implementó mediante el endpoint `POST /ventas`, que recibe el tipo de venta (`monetary` o `units`), el valor, la descripción y la fecha. El backend valida el payload con Zod, persiste la venta en SQLite y la asocia al usuario autenticado. En el frontend, el formulario de registro consume este endpoint a través de Redux Toolkit y redirige al dashboard al completarse.

**Visualizar progreso** se implementó en el endpoint `GET /progreso/:userId`, que recupera todas las metas del usuario y para cada una suma las ventas cuya fecha cae dentro del rango de la meta. Con esa suma calcula el porcentaje de avance y si la meta está activa. El dashboard consume este endpoint y muestra el progreso en tarjetas (`ProgressCard`) con barra de avance y valores absolutos.

**Desbloquear hitos** se implementó mediante un motor de reglas en el `AchievementService`. Cada vez que se registra una venta, el servicio evalúa todas las metas del usuario contra los logros definidos en la base de datos. Cada logro tiene una regla configurable (`threshold`, `early_completion`, `overshoot`, etc.) que determina cuándo se otorga. Los logros nuevos se devuelven en la misma respuesta del `POST /ventas` y el frontend los muestra en un modal de celebración al redirigir al dashboard.

## What's next?
Se crearon endpoints para crear metas, pero no se implementó en el frontend, a futuro el siguiente bloque sería el Dashboard para usuarios supervisores.
También sería ideal si las ventas llegaran de otro servicio de forma automática y no ingresadas manualmente por un usuario.

Por último, me quedé sin tiempo de implementar íconos y avatares para el sistema de logros (ver frontend/src/assets/avatar) 
