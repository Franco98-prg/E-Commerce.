const fs = require('fs');

class CartManager {
    constructor(path) {
        this.path = path;
    }

    async getCarts() {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                return JSON.parse(data);
            }
            return [];
        } catch (error) {
            console.error("Error al obtener carritos", error);
            return [];
        }
    }

    // Crear un carrito nuevo (vacío al principio)
    async createCart() {
        const carts = await this.getCarts();
        
        const newCart = {
            id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
            products: [] // El carrito nace vacío
        };

        carts.push(newCart);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
        return newCart;
    }

    async getCartById(cartId) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === cartId);
        if (!cart) return null;
        return cart;
    }

    // Agregar producto al carrito
    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(c => c.id === cartId);

        if (cartIndex === -1) return null;

        const cart = carts[cartIndex];

        // Verificar si el producto ya existe en el carrito
        const existingProductIndex = cart.products.findIndex(p => p.product === productId);

        if (existingProductIndex !== -1) {
            // Si existe, incrementamos la cantidad
            cart.products[existingProductIndex].quantity++;
        } else {
            // Si no existe, lo agregamos con quantity: 1
            cart.products.push({
                product: productId,
                quantity: 1
            });
        }

        // Actualizamos el carrito en el array general
        carts[cartIndex] = cart;

        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
        return cart;
    }
}

module.exports = CartManager;