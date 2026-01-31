const { Router } = require('express');
const CartManager = require('../managers/CartManager');

const router = Router();
// creamos el manager
const manager = new CartManager('./carts.json');

// 1. Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await manager.createCart();
        res.status(201).send({ message: "Carrito creado", cart: newCart });
    } catch (error) {
        res.status(500).send({ error: "Error al crear carrito" });
    }
});

// 2. Listar productos de un carrito específico
router.get('/:cid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const cart = await manager.getCartById(cid);

        if (!cart) {
            return res.status(404).send({ error: "Carrito no encontrado" });
        }

        // Solo enviamos los productos del carrito
        res.send(cart.products);
    } catch (error) {
        res.status(500).send({ error: "Error al obtener carrito" });
    }
});

// 3. Agregar un producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const pid = parseInt(req.params.pid);

        const cart = await manager.addProductToCart(cid, pid);

        if (!cart) {
            return res.status(404).send({ error: "Carrito no encontrado" });
        }

        res.send({ message: "Producto agregado al carrito", cart: cart });
    } catch (error) {
        res.status(500).send({ error: "Error al agregar producto al carrito" });
    }
});

module.exports = router;