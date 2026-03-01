const socket = io();


socket.on('updateProducts', (products) => {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; 

   
    products.forEach(product => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
        
        li.innerHTML = `
            <div class="ms-2 me-auto">
                <div class="fw-bold">${product.title}</div>
                ${product.description} - <span class="text-success">$${product.price}</span>
            </div>
            <span class="badge bg-primary rounded-pill">ID: ${product.id}</span>
        `;
        productList.appendChild(li);
    });
});


const productForm = document.getElementById('productForm');
productForm.addEventListener('submit', (e) => {
    e.preventDefault(); 

    const newProduct = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: Number(document.getElementById('price').value),
        code: document.getElementById('code').value,
        stock: Number(document.getElementById('stock').value),
        category: document.getElementById('category').value,
    };

    socket.emit('addProduct', newProduct); 
    productForm.reset(); 
});


const deleteForm = document.getElementById('deleteForm');
deleteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = Number(document.getElementById('deleteId').value);
    socket.emit('deleteProduct', id); 
    deleteForm.reset();
});