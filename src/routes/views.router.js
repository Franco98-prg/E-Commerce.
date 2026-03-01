const { Router } = require('express');
const ProductManager = require('../managers/ProductManager');

const router = Router();
const manager = new ProductManager('./products.json');


router.get('/', async (req, res) => {
    try {
        const products = await manager.getProducts();
        
        res.render('home', { products });
    } catch (error) {
        res.status(500).send({ error: "Error al cargar los productos" });
    }
});


router.get('/realtimeproducts', (req, res) => {

    res.render('realTimeProducts');
});

module.exports = router;