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

$$('.modal-close').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const which = e.currentTarget.dataset.close;
    if (which === 'login') close(loginModal);
    if (which === 'product') closeProductModal();
  });
});

[loginModal, productModal].forEach(m => 
  m.addEventListener('click', e => { 
    if (e.target === m) close(m); 
  })
);

window.addEventListener('keydown', e => { 
  if (e.key === 'Escape') { 
    close(loginModal);
    closeProductModal();
  } 
});

// ========================================
// LOGIN & REGISTER
// ========================================
const loginForm = $('#loginForm');
const msg = $('#msg');
const registerLink = $('.register-link a');
const loginTitle = $('#loginTitle');

let isRegister = false;

registerLink.addEventListener('click', (e) => {
  e.preventDefault();
  isRegister = !isRegister;
  loginTitle.textContent = isRegister ? 'Register' : 'Login';
  registerLink.innerHTML = isRegister ? `Already have an account? <a href="#">Login</a>` : `Don't have an account? <a href="#">Register</a>`;
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.textContent = '';
  
  const username = loginForm.username.value.trim();
  const password = loginForm.password.value.trim();
  
  if (!username || !password) {
    msg.textContent = 'Completa usuario y contraseña.'; 
    return; 
  }
  
  const url = isRegister ? `${API_URL}/auth/register` : `${API_URL}/auth/login`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  
  const data = await response.json();

  if (response.ok) {
    if (isRegister) {
      msg.textContent = 'Registration successful! Please log in.';
      msg.classList.add('ok');
      isRegister = false;
      loginTitle.textContent = 'Login';
      registerLink.innerHTML = `Don't have an account? <a href="#">Register</a>`;
    } else {
      localStorage.setItem('token', data.token);
      msg.textContent = 'Login exitoso ✅';
      msg.classList.add('ok');
      setTimeout(() => {
        close(loginModal);
        loadFavorites();
      }, 600);
    }
  } else {
    msg.textContent = data.msg;
    msg.classList.remove('ok');
  }
});

// ========================================
// INICIALIZACIÓN / INITIALIZATION
// ========================================
loadFavorites();
