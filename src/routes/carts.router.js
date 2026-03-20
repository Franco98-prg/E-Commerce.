const { Router } = require('express');
const CartModel = require('../models/cart.model'); // Aseguramos que use Mongoose, no FileSystem

const router = Router();

// 1. Crear un nuevo carrito (Vacío)
router.post('/', async (req, res) => {
    try {
        const newCart = await CartModel.create({ products: [] });
        // NOTA: Aquí enviamos 'payload' y 'status', que es lo que espera tu frontend
        res.status(201).send({ status: 'success', payload: newCart });
    } catch (error) {
        res.status(500).send({ status: 'error', error: "Error al crear carrito" });
    }
});

// 2. Obtener un carrito por ID (con populate automático)
router.get('/:cid', async (req, res) => {
    try {
        const cart = await CartModel.findById(req.params.cid);
        if (!cart) return res.status(404).send({ status: 'error', error: "Carrito no encontrado" });
        
        res.send({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).send({ status: 'error', error: "Error al obtener carrito" });
    }
});

// 3. Agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cart = await CartModel.findById(req.params.cid);
        if (!cart) return res.status(404).send({ status: 'error', error: "Carrito no encontrado" });

        const productIndex = cart.products.findIndex(p => p.product._id.toString() === req.params.pid);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity++;
        } else {
            cart.products.push({ product: req.params.pid, quantity: 1 });
        }

        await cart.save();
        res.send({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).send({ status: 'error', error: "Error al agregar producto" });
    }
});

// 4. ELIMINAR un producto específico
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await CartModel.findById(req.params.cid);
        if (!cart) return res.status(404).send({ status: 'error', error: "Carrito no encontrado" });

        cart.products = cart.products.filter(p => p.product._id.toString() !== req.params.pid);
        await cart.save();
        res.send({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).send({ status: 'error', error: "Error al eliminar producto" });
    }
});

// 5. ACTUALIZAR todo el arreglo de productos
router.put('/:cid', async (req, res) => {
    try {
        const cart = await CartModel.findById(req.params.cid);
        if (!cart) return res.status(404).send({ status: 'error', error: "Carrito no encontrado" });

        cart.products = req.body; 
        await cart.save();
        res.send({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).send({ status: 'error', error: "Error al actualizar carrito" });
    }
});

// 6. ACTUALIZAR SOLO la cantidad de un producto
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await CartModel.findById(req.params.cid);
        if (!cart) return res.status(404).send({ status: 'error', error: "Carrito no encontrado" });

        const productIndex = cart.products.findIndex(p => p.product._id.toString() === req.params.pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = req.body.quantity;
            await cart.save();
            res.send({ status: 'success', payload: cart });
        } else {
            res.status(404).send({ status: 'error', error: "Producto no encontrado en carrito" });
        }
    } catch (error) {
        res.status(500).send({ status: 'error', error: "Error al actualizar cantidad" });
    }
});

// 7. VACIAR el carrito por completo
router.delete('/:cid', async (req, res) => {
    try {
        const cart = await CartModel.findById(req.params.cid);
        if (!cart) return res.status(404).send({ status: 'error', error: "Carrito no encontrado" });

        cart.products = [];
        await cart.save();
        res.send({ status: 'success', message: "Carrito vaciado", payload: cart });
    } catch (error) {
        res.status(500).send({ status: 'error', error: "Error al vaciar carrito" });
    }
});

module.exports = router;