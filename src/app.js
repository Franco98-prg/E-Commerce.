require('dotenv').config();

const express = require('express');
const path = require('path');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose'); 

const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');

const ProductModel = require('./models/product.model');

const app = express();
const PORT = process.env.PORT || 8080

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Conectado exitosamente a MongoDB Atlas'))
    .catch((error) => console.error('Error en la conexión a la base de datos', error));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./src/public')); 


app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'handlebars');


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);  


const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});


const io = new Server(httpServer);

io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');


    const products = await ProductModel.find().lean();
    socket.emit('updateProducts', products);


    socket.on('addProduct', async (product) => {
        try {
            await ProductModel.create(product); 
            const updatedProducts = await ProductModel.find().lean();
            io.emit('updateProducts', updatedProducts); 
        } catch (error) {
            console.error("Error al agregar por socket:", error);
        }
    });


    socket.on('deleteProduct', async (id) => {
        try {
            await ProductModel.findByIdAndDelete(id); 
            const updatedProducts = await ProductModel.find().lean();
            io.emit('updateProducts', updatedProducts);
        } catch (error) {
            console.error("Error al eliminar por socket:", error);
        }
    });
});