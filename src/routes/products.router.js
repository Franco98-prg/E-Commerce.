const { Router } = require('express');
const ProductModel = require('../models/product.model'); 
const router = Router();

//Obtener productos con paginación, filtros y ordenamiento
router.get('/', async (req, res) => {
    try {

        let { limit = 10, page = 1, sort, query } = req.query;

        limit = parseInt(limit);
        page = parseInt(page);


        let filter = {};
        if (query) {

            if (query === 'true' || query === 'false') {
                filter.status = query === 'true';
            } else {

                filter.category = query;
            }
        }


        let sortOption = {};
        if (sort === 'asc') {
            sortOption.price = 1;
        } else if (sort === 'desc') {
            sortOption.price = -1;
        }


        const options = {
            page,
            limit,
            sort: sortOption,
            lean: true 
        };


        const result = await ProductModel.paginate(filter, options);


        const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;
        const prevLink = result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null;
        const nextLink = result.hasNextPage ? `${baseUrl}?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null;

        
        res.send({
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink,
            nextLink
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ status: 'error', error: "Error al obtener productos de la base de datos" });
    }
});

// Obtener un producto por ID
router.get('/:pid', async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.pid);
        if (!product) return res.status(404).send({ status: 'error', error: "Producto no encontrado" });
        
        res.send({ status: 'success', payload: product });
    } catch (error) {
        res.status(500).send({ status: 'error', error: "Formato de ID inválido o error interno" });
    }
});

//Agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        
        const newProduct = await ProductModel.create(req.body);
        res.status(201).send({ status: 'success', payload: newProduct });
    } catch (error) {
        
        res.status(400).send({ status: 'error', error: "Faltan campos obligatorios, el código ya existe, o formato inválido" });
    }
});

// Actualizar un producto
router.put('/:pid', async (req, res) => {
    try {

        const updatedProduct = await ProductModel.findByIdAndUpdate(req.params.pid, req.body, { new: true });
        if (!updatedProduct) return res.status(404).send({ status: 'error', error: "Producto no encontrado para actualizar" });
        
        res.send({ status: 'success', payload: updatedProduct });
    } catch (error) {
        res.status(500).send({ status: 'error', error: "Error al actualizar producto" });
    }
});

// Eliminar un producto
router.delete('/:pid', async (req, res) => {
    try {
        const deletedProduct = await ProductModel.findByIdAndDelete(req.params.pid);
        if (!deletedProduct) return res.status(404).send({ status: 'error', error: "Producto no encontrado para eliminar" });
        
        res.send({ status: 'success', message: "Producto eliminado exitosamente" });
    } catch (error) {
        res.status(500).send({ status: 'error', error: "Error al eliminar producto" });
    }
});

module.exports = router;