const { Router } = require('express');
const ProductManager = require('../managers/ProductManager');

const router = Router();
// creamos el manager indicando dónde se guardará el archivo
const manager = new ProductManager('./products.json');

// 1. Listar todos los productos (con límite opcional)
router.get('/', async (req, res) => {
    try {
        const products = await manager.getProducts();
        const limit = req.query.limit; // Capturamos el query param ?limit=

        if (limit) {
            // Si hay límite, devolvemos solo esa cantidad
            return res.send(products.slice(0, parseInt(limit)));
        }

        // Si no hay límite, enviamos todos
        res.send(products);
    } catch (error) {
        res.status(500).send({ error: "Error al obtener productos" });
    }
});

// 2. Obtener un producto por ID
router.get('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid); 
        const product = await manager.getProductById(pid);

        if (!product) {
            return res.status(404).send({ error: "Producto no encontrado" });
        }
        res.send(product);
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor" });
    }
});

// 3. Agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        const newProduct = req.body; // Los datos vienen en el cuerpo de la petición
        const addedProduct = await manager.addProduct(newProduct);

        if (!addedProduct) {
            return res.status(400).send({ error: "Faltan campos o el código ya existe" });
        }

        res.status(201).send({ message: "Producto creado", product: addedProduct });
    } catch (error) {
        res.status(500).send({ error: "Error al crear producto" });
    }
});

// 4. Actualizar un producto
router.put('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const updatedFields = req.body;
        const updatedProduct = await manager.updateProduct(pid, updatedFields);

        if (!updatedProduct) {
            return res.status(404).send({ error: "Producto no encontrado para actualizar" });
        }

        res.send({ message: "Producto actualizado", product: updatedProduct });
    } catch (error) {
        res.status(500).send({ error: "Error al actualizar producto" });
    }
});

// 5. Eliminar un producto
router.delete('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const isDeleted = await manager.deleteProduct(pid);

        if (!isDeleted) {
            return res.status(404).send({ error: "Producto no encontrado para eliminar" });
        }

        res.send({ message: "Producto eliminado exitosamente" });
    } catch (error) {
        res.status(500).send({ error: "Error al eliminar producto" });
    }
});

module.exports = router;