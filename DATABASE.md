# Esquema de la Base de Datos

Este archivo describe la estructura de la base de datos utilizada en el proyecto.

## Tablas Principales

### 1. **usuarios**
Contiene los datos de los Productores Asesores de Seguros (PAS).

| Campo           | Tipo    | Descripción                             |
|-----------------|---------|-----------------------------------------|
| id              | INT     | ID único del PAS                        |
| nombre          | VARCHAR | Nombre del PAS                          |
| telefono        | VARCHAR | Número de teléfono del PAS              |
| email           | VARCHAR | Correo electrónico del PAS              |
| fecha_creacion  | DATETIME| Fecha de creación del registro          |

### 2. **cotizaciones**
Contiene los datos de las cotizaciones solicitadas.

| Campo           | Tipo    | Descripción                             |
|-----------------|---------|-----------------------------------------|
| id              | INT     | ID único de la cotización               |
| usuario_id      | INT     | ID del PAS asociado                     |
| aseguradora     | VARCHAR | Nombre de la aseguradora                |
| precio          | DECIMAL | Precio de la cotización                 |
| fecha_solicitud | DATETIME| Fecha en que se solicitó la cotización  |

### 3. **leads**
Contiene la información de los leads o clientes potenciales.

| Campo           | Tipo    | Descripción                             |
|-----------------|---------|-----------------------------------------|
| id              | INT     | ID único del lead                       |
| nombre          | VARCHAR | Nombre del cliente                      |
| telefono        | VARCHAR | Número de teléfono del cliente          |
| email           | VARCHAR | Correo electrónico del cliente          |
| cotizacion_id   | INT     | ID de la cotización solicitada          |
| fecha_creacion  | DATETIME| Fecha de creación del lead              |

## Relaciones

- Un **PAS** puede tener múltiples **cotizaciones**.
- Un **lead** está relacionado con una **cotización** específica.
