// ========================================
// UTILIDADES / UTILITIES
// ========================================
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// ========================================
// GESTIÓN DE FAVORITOS / FAVORITES MANAGEMENT
// ========================================
// Sistema de favoritos usando localStorage
const FAVORITES_KEY = 'rigocompra_favorites';

function getFavorites() {
  const favs = localStorage.getItem(FAVORITES_KEY);
  return favs ? JSON.parse(favs) : [];
}

function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function isFavorite(productId) {
  const favorites = getFavorites();
  return favorites.includes(productId);
}

function toggleFavorite(productId) {
  let favorites = getFavorites();
  if (favorites.includes(productId)) {
    favorites = favorites.filter(id => id !== productId);
  } else {
    favorites.push(productId);
  }
  saveFavorites(favorites);
  updateFavoriteButtons(productId);
  return favorites.includes(productId);
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
// DATOS DE PRODUCTOS / PRODUCT DATA
// ========================================
// La información de productos ahora se carga desde data.js

// ========================================
// MODAL DE PRODUCTO / PRODUCT MODAL
// ========================================
const productModal = $('#productModal');
let currentProduct = null;

function openProductModal(product) {
  currentProduct = product;
  
  // Actualizar contenido del modal
  $('#productModalTitle').textContent = product.title;
  $('#productModalPrice').textContent = `Q${Number(product.price).toLocaleString('es-GT')}`;
  $('#productModalDesc').textContent = product.description || 'Sin descripción';
  $('#productModalCondition').textContent = product.condition || 'No especificado';
  $('#productModalCity').textContent = product.city;
  $('#productModalCategory').textContent = product.category;
  
  // Configurar imagen
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
  
  // Configurar botón de contacto (WhatsApp)
  const phone = '50212345678'; // EDITAR AQUÍ: Número de WhatsApp
  const message = encodeURIComponent(`Hola! Me interesa ${product.title} por Q${product.price}`);
  $('#productModalContact').href = `https://wa.me/${phone}?text=${message}`;
  
  // Actualizar botón de favoritos
  const favBtn = $('#productModalFavBtn');
  favBtn.classList.toggle('active', isFavorite(product.id));
  favBtn.setAttribute('data-product-id', product.id);
  
  // Abrir modal
  open(productModal);
}

function closeProductModal() {
  close(productModal);
  currentProduct = null;
}

// Event listener para botón de favoritos en modal
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
  
  // Media (imagen)
  const media = document.createElement('div');
  media.className = 'card-media ' + (item.image ? '' : 'placeholder');
  if (item.image) { 
    media.style.background = `center/cover no-repeat url('${item.image}')`; 
  }
  
  // Botón de favoritos en la card
  const favBtn = document.createElement('button');
  favBtn.className = 'card-fav-btn';
  favBtn.setAttribute('data-product-id', item.id);
  favBtn.setAttribute('aria-label', 'Agregar a favoritos');
  favBtn.innerHTML = '<i class="bx bx-heart"></i>';
  favBtn.classList.toggle('active', isFavorite(item.id));
  
  // Event listener para el botón de favoritos
  favBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Evitar que se abra el modal
    toggleFavorite(item.id);
  });
  
  media.appendChild(favBtn);
  
  // Body
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
  
  // Event listener para abrir modal al hacer clic en la card
  card.addEventListener('click', (e) => {
    // Solo abrir modal si no se hizo clic en el botón de favoritos
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
    // Mostrar mensaje cuando no hay productos
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
// RENDER INICIAL / INITIAL RENDER
// ========================================
renderList(mine, '#gridMine');
renderList(feed, '#gridFeed');
renderList(all, '#gridExplorar');
renderList(all, '#gridCategorias');
renderList(mine, '#gridMineOnly');

// ========================================
// BÚSQUEDA / SEARCH
// ========================================
const searchInput = $('#searchInput');
searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  const f = (it) => [it.title, it.city, it.category, it.description]
    .some(v => (v || '').toLowerCase().includes(q));
  
  renderList(mine.filter(f), '#gridMine');
  renderList(feed.filter(f), '#gridFeed');
  renderList(all.filter(f), '#gridExplorar');
  renderList(all.filter(f), '#gridCategorias');
});

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
      alert('Cerrar sesión (UI)'); 
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
    const list = (cat === 'Todos') ? all : all.filter(i => i.category === cat);
    renderList(list, '#gridCategorias');
  });
});

// ========================================
// MODALES: LOGIN / CREAR / PRODUCTO
// ========================================
const loginModal = $('#loginModal');
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

// Event listeners para abrir modales
$('#btnProfile').addEventListener('click', () => open(loginModal));
$('#btnCrear')?.addEventListener('click', () => { 
  open(createModal); 
  setTimeout(() => $('#f_title')?.focus(), 50); 
});
$('#navCrear').addEventListener('click', (e) => { 
  e.preventDefault(); 
  open(createModal); 
});

// Event listeners para cerrar modales
$$('.modal-close').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const which = e.currentTarget.dataset.close;
    if (which === 'login') close(loginModal);
    if (which === 'create') close(createModal);
    if (which === 'product') closeProductModal();
  });
});

// Cerrar al hacer clic fuera del modal
[loginModal, createModal, productModal].forEach(m => 
  m.addEventListener('click', e => { 
    if (e.target === m) close(m); 
  })
);

// Cerrar con tecla ESC
window.addEventListener('keydown', e => { 
  if (e.key === 'Escape') { 
    close(loginModal); 
    close(createModal);
    closeProductModal();
  } 
});

// ========================================
// LOGIN DEMO
// ========================================
const loginForm = $('#loginForm');
const msg = $('#msg');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.textContent = '';
  
  const u = loginForm.username.value.trim();
  const p = loginForm.password.value.trim();
  
  if (!u || !p) { 
    msg.textContent = 'Completa usuario y contraseña.'; 
    return; 
  }
  
  await new Promise(r => setTimeout(r, 350));
  
  if (u === 'admin' && p === 'admin123') { 
    msg.textContent = 'Login exitoso ✅'; 
    msg.classList.add('ok'); 
    setTimeout(() => close(loginModal), 600); 
  } else { 
    msg.textContent = 'Credenciales inválidas'; 
    msg.classList.remove('ok'); 
  }
});

// ========================================
// CREAR PUBLICACIÓN / CREATE POST
// ========================================
const createForm = $('#createForm');
const createMsg = $('#createMsg');

createForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // EDITAR AQUÍ: Validación y creación de nuevos productos
  const item = {
    id: crypto.randomUUID(),
    title: $('#f_title').value.trim(),
    price: Number($('#f_price').value || 0),
    city: $('#f_city').value.trim(),
    category: $('#f_category').value || 'Otros',
    image: $('#f_image').value.trim(),
    description: $('#f_desc').value.trim(),
    condition: 'Nuevo' // Valor por defecto
  };
  
  if (!item.title || !item.price || !item.city || !$('#f_category').value) {
    createMsg.textContent = 'Completa los campos obligatorios.';
    return;
  }
  
  // Agregar el nuevo producto
  mine.unshift(item);
  all.unshift(item);
  
  // Re-renderizar las listas
  renderList(mine, '#gridMine');
  renderList(mine, '#gridMineOnly');
  renderList(all, '#gridExplorar');
  renderList(all, '#gridCategorias');
  
  createMsg.textContent = 'Publicado ✅';
  createMsg.classList.add('ok');
  createForm.reset();
  
  setTimeout(() => { 
    createMsg.textContent = ''; 
    close(createModal); 
  }, 700);
});

// ========================================
// BADGES DEMO
// ========================================
const badgeMsg = $('#badgeMsg');
if (badgeMsg) { 
  badgeMsg.textContent = '2'; 
  badgeMsg.hidden = false; 
}

// ========================================
// CONSOLA DE DESARROLLO / DEV CONSOLE
// ========================================
console.log('🛒 RigoCompra! inicializado');
console.log('📦 Productos cargados:', all.length);
console.log('⭐ Favoritos guardados:', getFavorites().length);
