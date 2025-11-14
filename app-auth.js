// Lógica Login/Register - conecta modal con UserDAO

(function () {
  const dao = new window.UserDAO();

  let isRegisterMode = false;

  const loginForm = document.getElementById('loginForm');
  if (!loginForm) throw new Error('Login form (#loginForm) no encontrado');
  const loginTitle = document.getElementById('loginTitle');
  if (!loginTitle) throw new Error('Título (#loginTitle) no encontrado');
  const msg = document.getElementById('msg');
  if (!msg) throw new Error('Elemento de mensaje (#msg) no encontrado');
  const registerLink = document.querySelector('.register-link a');
  if (!registerLink) throw new Error('Enlace Register (.register-link a) no encontrado');
  const submitBtn = loginForm.querySelector('.btn');
  if (!submitBtn) throw new Error('Botón principal (.btn) no encontrado');

  function toggleMode() {
    isRegisterMode = !isRegisterMode;
    loginTitle.textContent = isRegisterMode ? "Register" : "Login";
    submitBtn.textContent = isRegisterMode ? "Create Account" : "Login";
    showMsg("", true);
  }

  function showMsg(text, ok = false) {
    msg.textContent = text || "";
    msg.className = ok ? "ok" : "";
  }

  async function handleRegister(email, password) {
    try {
      await dao.createUser(email, password);
      dao.saveToLocalStorage();
      showMsg('Usuario registrado con éxito.', true);
      if (isRegisterMode) toggleMode();
    } catch (e) {
      showMsg(e.message || "Error registrando usuario");
    }
  }

  async function handleLogin(email, password) {
    try {
      const valid = await dao.verifyPassword(email, password);
      if (valid) {
        showMsg('Login exitoso ✅', true);
        localStorage.setItem('rigocompra_session', email);
        // Opcional: cerrar modal si hay lógica específica existente
      } else {
        showMsg('Credenciales inválidas');
      }
    } catch (e) {
      showMsg("Error en login");
    }
  }

  registerLink.addEventListener('click', function (e) {
    e.preventDefault();
    toggleMode();
  });

  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = loginForm.username ? loginForm.username.value.trim() : '';
    const password = loginForm.password ? loginForm.password.value.trim() : '';
    if (!email || !password) {
      showMsg("Completa ambos campos para continuar");
      return;
    }
    if (isRegisterMode) {
      await handleRegister(email, password);
    } else {
      await handleLogin(email, password);
    }
  });

  // Inicialización
  (function initLoginAuth() {
    isRegisterMode = false;
    loginTitle.textContent = "Login";
    submitBtn.textContent = "Login";
    msg.textContent = "";
    showMsg("", true);
  })();

})();