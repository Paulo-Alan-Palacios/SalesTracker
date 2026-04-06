## ¿Qué cambiarías si este módulo fuera a producción con 10,000 usuarios activos?

- El principal punto es la escalabilidad
    - Load balancer con múltiples instancias del server
    - Background service o queue para revisar nuevos logros desbloqueados (en lugar de revisar en cada venta)
    - Base de datos compartida con las instancias; rate limiting, pagination, connection pooling, indexing de queries comunes, etc.
    - Redis para control de sesiones y administración de nuevos logros

## ¿Qué dejaste fuera por tiempo?

- Lo primero que haría sería robustecer el modelo de Usuario, agregar roles, permisos y un dashboard para usuarios supervisores que permita manipular las metas.
- Indicadores de tiempo para metas
    - Ritmo de crecimiento
    - Proyeccion para alcanzar meta, etc.
- Más tipos de operaciones en la API para las ventas.