const express = require('express');
const path = require('path');
const { Server } = require('socket.io'); 
const handlebars = require('express-handlebars'); 
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router'); 
const ProductManager = require('./managers/ProductManager');

const app = express();
const PORT = 8080;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./src/public')); 


app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'handlebars');

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);  


const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});


const io = new Server(httpServer);
const productManager = new ProductManager('./products.json');


io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');

    
    const products = await productManager.getProducts();
    socket.emit('updateProducts', products);

    
    socket.on('addProduct', async (product) => {
        await productManager.addProduct(product);
        
        const updatedProducts = await productManager.getProducts();
        io.emit('updateProducts', updatedProducts); 
    });

    
    socket.on('deleteProduct', async (id) => {
        await productManager.deleteProduct(id);
        
        const updatedProducts = await productManager.getProducts();
        io.emit('updateProducts', updatedProducts);
    });
});