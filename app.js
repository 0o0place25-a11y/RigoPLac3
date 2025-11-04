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
  loadApp();
};

let allProducts = [];
let userFavorites = [];

// ========================================
// GESTIÓN DE FAVORITOS / FAVORITES MANAGEMENT
// ========================================

function isFavorite(productId) {
  return userFavorites.includes(productId);
}

function updateFavoriteButtons(productId) {
  const isNowFav = isFavorite(productId);
  $$(`[data-product-id="${productId}"]`).forEach(btn => {
    btn.classList.toggle('active', isNowFav);
    btn.setAttribute('aria-label', isNowFav ? 'Quitar de favoritos' : 'Agregar a favoritos');
    btn.title = isNowFav ? 'Quitar de favoritos' : 'Agregar a favoritos';
  });
}

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
  favBtn.classList.toggle('active', isFavorite(product.id));
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
  favBtn.className = 'card-fav-btn';
  favBtn.setAttribute('data-product-id', item.id);
  favBtn.setAttribute('aria-label', 'Agregar a favoritos');
  favBtn.innerHTML = '<i class="bx bx-heart"></i>';
  favBtn.classList.toggle('active', isFavorite(item.id));
  
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

function renderList(list, sel) {
  const el = $(sel); 
  if (!el) return;
  el.innerHTML = '';
  
  if (list.length === 0) {
    el.innerHTML = `
      <div class="empty-state">
        <i class='bx bx-package'></i>
        <h3>No hay productos para mostrar</h3>
        <p>Intenta ajustar tus filtros de búsqueda</p>
      </div>`;
    return;
  }
  
  list.forEach(i => el.appendChild(createCard(i)));
}

// ========================================
// NAVEGACIÓN POR VISTAS / VIEW NAVIGATION
// ========================================
const views = $$('.view');
const navItems = $$('.nav-item[data-view]');

function showView(name) {
  views.forEach(v => v.hidden = true);
  const el = document.getElementById(`view-${name}`);
  if (el) el.hidden = false;
  navItems.forEach(a => a.classList.toggle('active', a.dataset.view === name));
}

const defaultView = $('.view[data-default]');
if (defaultView) defaultView.hidden = false;

navItems.forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const name = a.dataset.view;
    if (name === 'salir') { 
      localStorage.removeItem('token');
      window.location.reload();
      return; 
    }
    showView(name);
  });
});

// ========================================
// FILTROS DE CATEGORÍA / CATEGORY FILTERS
// ========================================
$$('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    $$('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const cat = chip.dataset.cat;
    const list = (cat === 'Todos') ? allProducts : allProducts.filter(i => i.category === cat);
    renderList(list, '#gridCategorias');
  });
});

// ========================================
// MODALES: LOGIN / REGISTER / CREAR / PRODUCTO
// ========================================
const loginModal = $('#loginModal');
const registerModal = $('#registerModal');
const createModal = $('#createModal');

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
$('#navCrear').addEventListener('click', (e) => { 
  e.preventDefault(); 
  open(createModal); 
});
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
    if (which === 'create') close(createModal);
    if (which === 'product') closeProductModal();
  });
});

[loginModal, registerModal, createModal, productModal].forEach(m =>
  m.addEventListener('click', e => { 
    if (e.target === m) close(m); 
  })
);

window.addEventListener('keydown', e => { 
  if (e.key === 'Escape') { 
    close(loginModal);
    close(registerModal);
    close(createModal);
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
      loadApp();
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
// CREAR PUBLICACIÓN / CREATE POST
// ========================================
const createForm = $('#createForm');
const createMsg = $('#createMsg');

createForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please log in to create a post');
    return;
  }

  const item = {
    id: crypto.randomUUID(),
    title: $('#f_title').value.trim(),
    price: Number($('#f_price').value || 0),
    city: $('#f_city').value.trim(),
    category: $('#f_category').value || 'Otros',
    image: $('#f_image').value.trim(),
    description: $('#f_desc').value.trim(),
    condition: 'Nuevo'
  };
  
  if (!item.title || !item.price || !item.city || !$('#f_category').value) {
    createMsg.textContent = 'Completa los campos obligatorios.';
    return;
  }
  
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token
    },
    body: JSON.stringify(item)
  });
  
  if (response.ok) {
    createMsg.textContent = 'Publicado ✅';
    createMsg.classList.add('ok');
    createForm.reset();
    setTimeout(() => {
      createMsg.textContent = '';
      close(createModal);
      loadApp();
    }, 700);
  } else {
    createMsg.textContent = 'Error creating post';
  }
});

// ========================================
// LOAD APP
// ========================================
async function loadApp() {
  allProducts = await getProducts();
  if (localStorage.getItem('token')) {
    userFavorites = await getFavorites();
  }

  renderList(allProducts, '#gridFeed');
  renderList(allProducts, '#gridCategorias');
  renderList([], '#gridMine');
  renderList([], '#gridMineOnly');

  if(localStorage.getItem('token')) {
    $('#btnProfile').innerHTML = `<i class='bx bxs-user'></i>`;
  }
}

loadApp();
