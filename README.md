# ☕ Hortiocla Lavalle - Backend (Segunda Entrega)

Este proyecto representa la evolución del backend del e-commerce. Hemos integrado **motores de plantillas** para la renderización de vistas dinámicas y **WebSockets** para permitir una comunicación bidireccional y actualizaciones del inventario en tiempo real.

## 🚀 Novedades en esta entrega

* **Interfaz Gráfica (Handlebars):** Implementación de vistas dinámicas para dejar de consumir la API exclusivamente vía Postman/ThunderClient.
* **Tiempo Real (Socket.io):** Conexión bidireccional entre el cliente y el servidor. Al agregar o eliminar un producto, la vista se actualiza automáticamente para todos los clientes conectados sin necesidad de recargar la página.
* **Diseño UI:** Integración de Bootstrap para un panel de gestión limpio, responsive y profesional.

## 🛠️ Tecnologías Utilizadas

* **Node.js & Express:** Entorno de ejecución y framework del servidor.
* **Express-Handlebars:** Motor de plantillas para generar el HTML dinámico.
* **Socket.io:** Librería para la comunicación en tiempo real (WebSockets).
* **FileSystem (fs):** Persistencia de datos en formato JSON.
* **Bootstrap 5:** Framework CSS para el diseño de la interfaz.

## ⚙️ Instrucciones de Instalación

1. Clonar el repositorio.
2. Instalar las dependencias del proyecto:
   ```bash
   npm install