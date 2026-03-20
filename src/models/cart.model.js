const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products' // Referencia a la colección de productos para hacer "populate"
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
        default: []
    }
});

// Middleware de Mongoose: Cada vez que hagamos un 'find' o 'findOne' en carritos, 
// automáticamente hará el 'populate' de los productos.
cartSchema.pre('find', function() {
    this.populate('products.product');
});
cartSchema.pre('findOne', function() {
    this.populate('products.product');
});

const CartModel = mongoose.model('carts', cartSchema);

module.exports = CartModel;