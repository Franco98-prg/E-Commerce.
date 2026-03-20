# ☕ Santino Coffee Shop - Backend System (Entrega Final)

Este proyecto es la arquitectura backend desarrollada para **Santino**, una cafetería de especialidad ubicada en el Museo de Arte Contemporáneo de Corrientes Capital, Argentina. 

El sistema está diseñado para gestionar de manera eficiente el catálogo de productos y las órdenes de compra, soportando la operativa en tiempo real para un local con capacidad de 70 a 80 personas. Esta versión final migra la persistencia de datos a la nube utilizando **MongoDB Atlas**.

## 🚀 Características Principales

* **Catálogo Dinámico y Paginado:** Renderizado de productos utilizando Handlebars y Bootstrap, con soporte de paginación asíncrona a través de `mongoose-paginate-v2`.
* **Gestión de Inventario en Tiempo Real:** Panel de control protegido conectado vía WebSockets (`Socket.io`). Permite agregar o eliminar productos del menú actualizando las pantallas de todos los clientes instantáneamente.
* **Carrito de Compras Inteligente:** Lógica completa de e-commerce almacenada en MongoDB. Permite agregar productos, modificar cantidades, eliminar ítems individuales o vaciar el carrito por completo.
* **Persistencia en la Nube:** Integración total con MongoDB Atlas mediante `Mongoose`, utilizando esquemas estrictos de validación, referencias y el método `populate` para relacionar carritos con productos.

## 🛠️ Stack Tecnológico

* **Entorno:** Node.js
* **Framework:** Express.js
* **Base de Datos:** MongoDB Atlas (Mongoose ODM)
* **Motores de Plantillas:** Express-Handlebars
* **Tiempo Real:** Socket.io
* **Frontend UI:** Bootstrap 5 / CSS Vanilla

## ⚙️ Instalación y Configuración Local

1. Clonar este repositorio en tu máquina local.
2. Instalar las dependencias del proyecto:
   ```bash
   npm install