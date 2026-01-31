const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path; // La ruta donde se guardará el archivo JSON
    }

    // Lee el archivo 
    async getProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                return JSON.parse(data);
            }
            // Si el archivo no existe, devolvemos un array vacío
            return [];
        } catch (error) {
            console.error("Error al obtener productos:", error);
            return [];
        }
    }

    // Método para agregar producto
    async addProduct(product) {
        try {
            const products = await this.getProducts();

            if (!product.title || !product.description || !product.price || !product.code || !product.stock || !product.category) {
                console.log("Faltan campos obligatorios");
                return null;
            }

            if (products.some(p => p.code === product.code)) {
                console.log("El código del producto ya existe");
                return null;
            }

            const newProduct = {
                id: products.length > 0 ? products[products.length - 1].id + 1 : 1, // Si hay productos, suma 1 al último id. Si no, empieza en 1.
                title: product.title,
                description: product.description,
                code: product.code,
                price: product.price,
                status: true, 
                stock: product.stock,
                category: product.category,
                thumbnails: product.thumbnails || [] 
            };

            products.push(newProduct);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            
            return newProduct;

        } catch (error) {
            console.log("Error al guardar producto", error);
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        const product = products.find(p => p.id === id);
        
        if (!product) {
            console.error("Producto no encontrado");
            return null;
        }
        return product;
    }

    async updateProduct(id, updatedFields) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id === id);

        if (index === -1) return null; // No encontrado

        const productUpdated = { ...products[index], ...updatedFields, id: products[index].id };
        products[index] = productUpdated;

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        return productUpdated;
    }

    async deleteProduct(id) {
        const products = await this.getProducts();

        const newProducts = products.filter(p => p.id !== id);

        if (products.length === newProducts.length) return null; // No borró nada

        await fs.promises.writeFile(this.path, JSON.stringify(newProducts, null, '\t'));
        return true;
    }
}

module.exports = ProductManager;