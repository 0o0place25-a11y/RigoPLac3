// ========================================
// PÁGINA DE FAVORITOS / FAVORITES PAGE
// ========================================

// ========================================
// UTILIDADES / UTILITIES
// ========================================
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// ========================================
// GESTIÓN DE FAVORITOS / FAVORITES MANAGEMENT
// ========================================
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
  
  // Actualizar la vista de favoritos
  loadFavorites();
  
  return favorites.includes(productId);
}

function clearAllFavorites() {
  if (confirm('¿Estás seguro de que quieres eliminar todos tus favoritos?')) {
    localStorage.removeItem(FAVORITES_KEY);
    loadFavorites();
  }
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

// Crear un mapa de productos por ID para acceso rápido
const productsMap = new Map();
all.forEach(product => {
  productsMap.set(product.id, product);
});

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
  favBtn.className = 'card-fav-btn active'; // Siempre activo en la página de favoritos
  favBtn.setAttribute('data-product-id', item.id);
  favBtn.setAttribute('aria-label', 'Quitar de favoritos');
  favBtn.title = 'Quitar de favoritos';
  favBtn.innerHTML = '<i class="bx bx-heart"></i>';
  
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

// ========================================
// CARGAR FAVORITOS / LOAD FAVORITES
// ========================================
function loadFavorites(searchQuery = '') {
  const favoriteIds = getFavorites();
  const gridFavorites = $('#gridFavorites');
  const emptyState = $('#emptyState');
  const favCount = $('#favCount');
  const clearBtn = $('#clearAllFavs');
  
  // Obtener productos favoritos
  let favoriteProducts = favoriteIds
    .map(id => productsMap.get(id))
    .filter(product => product !== undefined);
  
  // Aplicar filtro de búsqueda si existe
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    favoriteProducts = favoriteProducts.filter(product => 
      [product.title, product.city, product.category, product.description]
        .some(v => (v || '').toLowerCase().includes(q))
    );
  }
  
  // Actualizar contador
  const totalFavs = getFavorites().length;
  favCount.textContent = `${totalFavs} producto${totalFavs !== 1 ? 's' : ''}`;
  
  // Mostrar/ocultar botón de limpiar
  if (totalFavs > 0) {
    clearBtn.style.display = 'grid';
  } else {
    clearBtn.style.display = 'none';
  }
  
  // Mostrar productos o estado vacío
  if (favoriteProducts.length === 0) {
    gridFavorites.innerHTML = '';
    gridFavorites.style.display = 'none';
    emptyState.style.display = 'block';
    
    if (searchQuery && totalFavs > 0) {
      // Si hay búsqueda pero no resultados
      emptyState.innerHTML = `
        <i class='bx bx-search-alt'></i>
        <h3>No se encontraron resultados</h3>
        <p>Intenta con otros términos de búsqueda</p>
      `;
    } else {
      // Si no hay favoritos
      emptyState.innerHTML = `
        <i class='bx bx-heart-circle'></i>
        <h3>No tienes productos favoritos aún</h3>
        <p>Explora productos y marca tus favoritos haciendo clic en el ❤️</p>
        <a href="index.html" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: var(--accent); color: #fff; border-radius: 12px; text-decoration: none; font-weight: 600;">
          Explorar productos
        </a>
      `;
    }
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
// LIMPIAR TODOS LOS FAVORITOS / CLEAR ALL FAVORITES
// ========================================
$('#clearAllFavs').addEventListener('click', clearAllFavorites);

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

// Event listeners para abrir modales
$('#btnProfile').addEventListener('click', () => open(loginModal));

// Event listeners para cerrar modales
$$('.modal-close').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const which = e.currentTarget.dataset.close;
    if (which === 'login') close(loginModal);
    if (which === 'product') closeProductModal();
  });
});

// Cerrar al hacer clic fuera del modal
[loginModal, productModal].forEach(m => 
  m.addEventListener('click', e => { 
    if (e.target === m) close(m); 
  })
);

// Cerrar con tecla ESC
window.addEventListener('keydown', e => { 
  if (e.key === 'Escape') { 
    close(loginModal);
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
// INICIALIZACIÓN / INITIALIZATION
// ========================================
loadFavorites();

console.log('❤️ Página de Favoritos inicializada');
console.log('⭐ Favoritos guardados:', getFavorites().length);
