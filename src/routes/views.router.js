const { Router } = require('express');
const ProductModel = require('../models/product.model');
const CartModel = require('../models/cart.model');

const router = Router();
router.get('/', (req, res) => {
    res.redirect('/products');
});


router.get('/products', async (req, res) => {
    try {
        let { page = 1, limit = 9 } = req.query; 
        const options = { 
            page: parseInt(page), 
            limit: parseInt(limit), 
            lean: true 
        };

        const result = await ProductModel.paginate({}, options);
        
        res.render('products', { 
            products: result.docs,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page
        });
    } catch (error) {
        res.status(500).send("Error al cargar la vista de productos");
    }
});


router.get('/products/:pid', async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.pid).lean();
        if (!product) return res.status(404).send("Producto no encontrado");
        
        res.render('productDetail', { product });
    } catch (error) {
        res.status(500).send("Error al cargar el detalle del producto");
    }
});


router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await CartModel.findById(req.params.cid).lean();
        if (!cart) return res.status(404).send("Carrito no encontrado");
        
        res.render('cart', { cart });
    } catch (error) {
        res.status(500).send("Error al cargar el carrito");
    }
});

module.exports = router;