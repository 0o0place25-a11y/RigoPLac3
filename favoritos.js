// ========================================
// PÁGINA DE FAVORITOS / FAVORITES PAGE
// ========================================

// ========================================
// UTILIDADES / UTILITIES
// ========================================
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// ========================================
// API HELPERS
// ========================================
const API_URL = 'http://localhost:5000/api';

const getProducts = async () => {
  const response = await fetch(`${API_URL}/products`);
  return response.json();
};

const getFavorites = async () => {
  const token = localStorage.getItem('token');
  if (!token) return [];
  const response = await fetch(`${API_URL}/favorites`, {
    headers: { 'x-auth-token': token }
  });
  return response.json();
};

const toggleFavorite = async (productId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please log in to manage favorites');
    return;
  }
  await fetch(`${API_URL}/favorites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token
    },
    body: JSON.stringify({ productId })
  });
  loadFavorites();
};

let allProducts = [];
let userFavorites = [];
let productsMap = new Map();

// ========================================
// MODAL DE PRODUCTO / PRODUCT MODAL
// ========================================
const productModal = $('#productModal');
let currentProduct = null;

function openProductModal(product) {
  currentProduct = product;
  
  $('#productModalTitle').textContent = product.title;
  $('#productModalPrice').textContent = `Q${Number(product.price).toLocaleString('es-GT')}`;
  $('#productModalDesc').textContent = product.description || 'Sin descripción';
  $('#productModalCondition').textContent = product.condition || 'No especificado';
  $('#productModalCity').textContent = product.city;
  $('#productModalCategory').textContent = product.category;
  
  const imgEl = $('#productModalImg');
  const imgContainer = imgEl.parentElement;
  if (product.image) {
    imgEl.src = product.image;
    imgEl.style.display = 'block';
    imgContainer.classList.remove('placeholder');
  } else {
    imgEl.style.display = 'none';
    imgContainer.classList.add('placeholder');
  }
  
  const phone = '50212345678';
  const message = encodeURIComponent(`Hola! Me interesa ${product.title} por Q${product.price}`);
  $('#productModalContact').href = `https://wa.me/${phone}?text=${message}`;
  
  const favBtn = $('#productModalFavBtn');
  favBtn.classList.toggle('active', userFavorites.includes(product.id));
  favBtn.setAttribute('data-product-id', product.id);
  
  open(productModal);
}

function closeProductModal() {
  close(productModal);
  currentProduct = null;
}

$('#productModalFavBtn').addEventListener('click', (e) => {
  e.stopPropagation();
  if (currentProduct) {
    toggleFavorite(currentProduct.id);
  }
});

// ========================================
// CREACIÓN DE CARDS / CARD CREATION
// ========================================
function createCard(item) {
  const card = document.createElement('article');
  card.className = 'card';
  card.setAttribute('data-product-id', item.id);
  
  const media = document.createElement('div');
  media.className = 'card-media ' + (item.image ? '' : 'placeholder');
  if (item.image) { 
    media.style.background = `center/cover no-repeat url('${item.image}')`; 
  }
  
  const favBtn = document.createElement('button');
  favBtn.className = 'card-fav-btn active';
  favBtn.setAttribute('data-product-id', item.id);
  favBtn.setAttribute('aria-label', 'Quitar de favoritos');
  favBtn.title = 'Quitar de favoritos';
  favBtn.innerHTML = '<i class="bx bx-heart"></i>';
  
  favBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFavorite(item.id);
  });
  
  media.appendChild(favBtn);
  
  const body = document.createElement('div');
  body.className = 'card-body';
  body.innerHTML = `
    <h3 class="card-title">${item.title}</h3>
    <p class="card-text">${item.description || ''}</p>
    <div class="card-meta">
      <span>Q${Number(item.price).toLocaleString('es-GT')}</span>
      <span>• ${item.city}</span>
      <span>• ${item.category}</span>
    </div>`;
  
  card.addEventListener('click', (e) => {
    if (!e.target.closest('.card-fav-btn')) {
      openProductModal(item);
    }
  });
  
  card.append(media, body);
  return card;
}

// ========================================
// CARGAR FAVORITOS / LOAD FAVORITES
// ========================================
async function loadFavorites(searchQuery = '') {
  allProducts = await getProducts();
  allProducts.forEach(p => productsMap.set(p.id, p));
  userFavorites = await getFavorites();

  const gridFavorites = $('#gridFavorites');
  const emptyState = $('#emptyState');
  const favCount = $('#favCount');
  
  let favoriteProducts = userFavorites
    .map(id => productsMap.get(id))
    .filter(product => product !== undefined);
  
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    favoriteProducts = favoriteProducts.filter(product => 
      [product.title, product.city, product.category, product.description]
        .some(v => (v || '').toLowerCase().includes(q))
    );
  }
  
  favCount.textContent = `${userFavorites.length} producto${userFavorites.length !== 1 ? 's' : ''}`;
  
  if (favoriteProducts.length === 0) {
    gridFavorites.innerHTML = '';
    gridFavorites.style.display = 'none';
    emptyState.style.display = 'block';
  } else {
    gridFavorites.innerHTML = '';
    gridFavorites.style.display = 'grid';
    emptyState.style.display = 'none';
    favoriteProducts.forEach(product => {
      gridFavorites.appendChild(createCard(product));
    });
  }
}

// ========================================
// BÚSQUEDA EN FAVORITOS / SEARCH IN FAVORITES
// ========================================
const searchInput = $('#searchInput');
searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim();
  loadFavorites(query);
});

// ========================================
// MODALES / MODALS
// ========================================
const loginModal = $('#loginModal');
const registerModal = $('#registerModal');

const open = (el) => { 
  el.classList.add('open'); 
  el.setAttribute('aria-hidden', 'false'); 
  document.body.style.overflow = 'hidden';
};

const close = (el) => { 
  el.classList.remove('open'); 
  el.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

$('#btnProfile').addEventListener('click', () => open(loginModal));
$('#showRegister').addEventListener('click', () => {
  close(loginModal);
  open(registerModal);
});
$('#showLogin').addEventListener('click', () => {
  close(registerModal);
  open(loginModal);
});

$$('.modal-close').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const which = e.currentTarget.dataset.close;
    if (which === 'login') close(loginModal);
    if (which === 'register') close(registerModal);
    if (which === 'product') closeProductModal();
  });
});

[loginModal, registerModal, productModal].forEach(m =>
  m.addEventListener('click', e => { 
    if (e.target === m) close(m); 
  })
);

window.addEventListener('keydown', e => { 
  if (e.key === 'Escape') { 
    close(loginModal);
    close(registerModal);
    closeProductModal();
  } 
});

// ========================================
// LOGIN & REGISTER
// ========================================
const loginForm = $('#loginForm');
const loginMsg = $('#loginMsg');
const registerForm = $('#registerForm');
const registerMsg = $('#registerMsg');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginMsg.textContent = '';
  
  const email = $('#loginEmail').value.trim();
  const password = $('#loginPassword').value.trim();
  
  if (!email || !password) {
    loginMsg.textContent = 'Completa email y contraseña.';
    return; 
  }
  
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();

  if (response.ok) {
    localStorage.setItem('token', data.token);
    loginMsg.textContent = 'Login exitoso ✅';
    loginMsg.classList.add('ok');
    setTimeout(() => {
      close(loginModal);
      loadFavorites();
    }, 600);
  } else {
    loginMsg.textContent = data.msg;
    loginMsg.classList.remove('ok');
  }
});

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  registerMsg.textContent = '';

  const name = $('#registerName').value.trim();
  const email = $('#registerEmail').value.trim();
  const password = $('#registerPassword').value.trim();

  if (!name || !email || !password) {
    registerMsg.textContent = 'Completa todos los campos.';
    return;
  }

  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });

  const data = await response.json();

  if (response.ok) {
    registerMsg.textContent = 'Registro exitoso! Por favor, inicia sesión.';
    registerMsg.classList.add('ok');
    setTimeout(() => {
      close(registerModal);
      open(loginModal);
    }, 1000);
  } else {
    registerMsg.textContent = data.msg;
    registerMsg.classList.remove('ok');
  }
});

// ========================================
// INICIALIZACIÓN / INITIALIZATION
// ========================================
loadFavorites();
