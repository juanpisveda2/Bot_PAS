# Guía de Despliegue y Configuración

Este archivo detalla los pasos para desplegar el proyecto desde cero, configurar el webhook de Meta y conectar con la base de datos.

## Paso 1: Clonar el Repositorio

git clone https://github.com/tu-usuario/tu-repo.git

## Paso 2: Configuración del Proyecto

1. Instalar las dependencias:
    
    npm install

2. Configurar el archivo .env con las siguientes variables:

    DB_HOST=tu_base_de_datos
    DB_USER=usuario
    DB_PASS=contraseña
    DB_NAME=nombre_de_base
    PHONE_NUMBER_ID=tu_phone_number_id

3. Si es necesario, crear una base de datos en Railway o en cualquer servicio y actualizar las variables en el archivo .env

## Paso 3: Configuración del Webhook en Meta

1. Ir a Meta for Developers y acceder a tu cuenta.
2. Crear una nueva aplicación y configura un webhook para tu número de WhatsApp.
3. Asegurarse de que el servidor esté accesible para recibir los mensajes.
4. Configurar la URL del webhook en Meta apuntando a la ruta de tu backend.

## Paso 4: Despliegue

1. En Render:
    - Iniciar sesión en Render.
    - Crear un servicio web y conectar tu repositorio.
    - Configurar las variables de entorno en el panel de Render.
    - Desplegar el servicio y asegurarse de que todo esté funcionando.
2. En Railway:
    - Iniciar sesión en Railway.
    - Subir la base de datos y configurar la conexión.
    - Asegurarse de que las variables de entorno estén configuradas correctamente.
