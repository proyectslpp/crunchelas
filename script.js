function showNotification(message, type = 'success') {
    // Eliminar notificación existente si hay alguna
    const existingNotification = document.querySelector('.custom-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Crear el elemento de notificación
    const notification = document.createElement('div');
    notification.className = `custom-notification ${type}`;
    
    // Crear el contenido de la notificación
    notification.innerHTML = `
        <div class="notification-content">
            ${type === 'success' ? '✅' : '⚠️'} 
            <span>${message}</span>
        </div>
        <button class="notification-close">×</button>
    `;

    // Añadir al DOM
    document.body.appendChild(notification);

    // Añadir evento para cerrar la notificación
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => notification.remove());

    // Animar entrada
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Datos de productos
const products = [
    {
        id: 1,
        name: "Galletas de Chocolate",
        price: 4.99,
        description: "Deliciosas galletas con trozos de chocolate belga premium. Horneadas a la perfección para conseguir el equilibrio perfecto entre crujiente por fuera y tierno por dentro.",
        images: [
            "./fotos/galletas-de-chocolate-1.jpg",
            "./fotos/galletas-de-chocolate-2.jpg",
            "./fotos/galletas-de-chocolate-3.jpg",
            "./fotos/galletas-de-chocolate-4.jpg"
        ]
    },
    {
        id: 2,
        name: "Galletas de Vainilla",
        price: 4.49,
        description: "Suaves galletas con auténtica vainilla de Madagascar. Su delicado sabor y textura aterciopelada las convierten en el acompañamiento perfecto para el té.",
        images: [
            "./fotos/galletas-de-vainilla-1.jpg",
            "./fotos/galletas-de-vainilla-2.jpg",
            "./fotos/galletas-de-vainilla-3.jpg",
            "./fotos/galletas-de-vainilla-4.jpg"
        ]
    },
    {
        id: 3,
        name: "Galletas de Avena",
        price: 3.99,
        description: "Nutritivas galletas de avena con un toque de canela. Elaboradas con avena integral y endulzadas con miel natural, son perfectas para un desayuno saludable.",
        images: [
            "./fotos/galletas-de-avena-1.jpg",
            "./fotos/galletas-de-avena-2.jpg",
            "./fotos/galletas-de-avena-3.jpg",
            "./fotos/galletas-de-avena-4.jpg"
        ]
    }
];

// Estado del carrito y modal
let cart = [];
let currentImageIndex = 0;
let currentProduct = null;

// Funciones del carrito
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    sidebar.classList.toggle('active');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
        showNotification(`¡Se ha añadido otra unidad de ${product.name} al carrito!`);
    } else {
        cart.push({ ...product, quantity: 1 });
        showNotification(`¡${product.name} añadido al carrito!`);
    }

    updateCartUI();
}

function removeFromCart(productId) {
    const product = cart.find(item => item.id === productId);
    if (product) {
        showNotification(`${product.name} eliminado del carrito`, 'error');
    }
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateCartUI() {
    const cartItems = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.getElementById('cartTotal');
    
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.images[0]}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>Cantidad: ${item.quantity}</p>
                <p class="cart-item-price">€${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <button onclick="removeFromCart(${item.id})" class="cart-item-remove">×</button>
        </div>
    `).join('');

    cartTotal.textContent = '€' + cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
}

// Funciones del modal y carrusel
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    currentProduct = product;
    currentImageIndex = 0;
    updateModalContent();
    document.getElementById('productModal').style.display = 'flex';
}

function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
}

function nextImage() {
    if (!currentProduct) return;
    currentImageIndex = (currentImageIndex + 1) % currentProduct.images.length;
    updateModalContent();
}

function previousImage() {
    if (!currentProduct) return;
    currentImageIndex = (currentImageIndex - 1 + currentProduct.images.length) % currentProduct.images.length;
    updateModalContent();
}

function updateModalContent() {
    if (!currentProduct) return;
    
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <div class="modal-carousel">
            <img src="${currentProduct.images[currentImageIndex]}" alt="${currentProduct.name}">
            <button class="carousel-btn prev" onclick="previousImage()">❮</button>
            <button class="carousel-btn next" onclick="nextImage()">❯</button>
            <div class="carousel-dots">
                ${currentProduct.images.map((_, index) => `
                    <span class="dot ${index === currentImageIndex ? 'active' : ''}"
                          onclick="currentImageIndex = ${index}; updateModalContent()"></span>
                `).join('')}
            </div>
        </div>
        <div class="modal-info">
            <h2>${currentProduct.name}</h2>
            <p class="modal-description">${currentProduct.description}</p>
            <p class="modal-price">€${currentProduct.price.toFixed(2)}</p>
            <button class="btn btn-primary" onclick="addToCart(${currentProduct.id}); closeProductModal()">
                Añadir al carrito
            </button>
        </div>
    `;
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío', 'error');
        return;
    }
    const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    showNotification(`¡Gracias por tu compra! 🎉\nTotal: €${total}`);
    cart = [];
    updateCartUI();
    toggleCart();
}

// Función para cargar los productos en la cuadrícula
function loadProducts() {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = products.map(product => `
        <div class="product-card" onclick="openProductModal(${product.id})">
            <img src="${product.images[0]}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">€${product.price.toFixed(2)}</p>
            </div>
        </div>
    `).join('');
}

// Función para scrollear a la sección de productos
function scrollToProducts() {
    document.getElementById('productos').scrollIntoView({ behavior: 'smooth' });
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCartUI();

    // Cerrar modal al hacer clic fuera
    window.onclick = function(event) {
        const modal = document.getElementById('productModal');
        if (event.target === modal) {
            closeProductModal();
        }
    };
});