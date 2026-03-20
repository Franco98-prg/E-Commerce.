
async function addToCart(productId) {
    try {
        let cartId = localStorage.getItem('cartId');

        if (!cartId) {
            console.log("No hay carrito en memoria, creando uno nuevo...");
            const response = await fetch('/api/carts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            
            const data = await response.json();
            console.log("Respuesta del servidor al crear carrito:", data); 


            if (data.payload && data.payload._id) {
                cartId = data.payload._id;
            } else if (data.cart && data.cart._id) {
                cartId = data.cart._id;
            } else {
                alert("Error crítico: El servidor no devolvió el ID del carrito.");
                return; 
            }
            
            localStorage.setItem('cartId', cartId); 
        }


        const addResponse = await fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (addResponse.ok) {
            alert('¡Producto agregado al carrito exitosamente!');
        } else {
            const errorData = await addResponse.json();
            console.error("Error al agregar producto:", errorData);
            alert('Error al agregar el producto al carrito');
        }
    } catch (error) {
        console.error('Error en el script:', error);
        alert('Hubo un error de conexión');
    }
}

function goToCart() {

    const cartId = localStorage.getItem('cartId');

    if (cartId) {

        window.location.href = `/carts/${cartId}`;
    } else {

        alert("Tu carrito está vacío. ¡Agrega algunos productos de especialidad primero!");
    }
}

async function removeFromCart(productId) {
    const cartId = localStorage.getItem('cartId');
    if (!cartId) return;

    if (!confirm('¿Seguro que deseas quitar este producto de tu pedido?')) return;

    try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            
            window.location.reload();
        } else {
            alert('Error al eliminar el producto');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


async function clearCart() {
    const cartId = localStorage.getItem('cartId');
    if (!cartId) return;

    if (!confirm('¿Estás seguro de que quieres vaciar todo tu carrito?')) return;

    try {
        const response = await fetch(`/api/carts/${cartId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            window.location.reload();
        } else {
            alert('Error al vaciar el carrito');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}