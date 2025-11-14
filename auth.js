// auth.js

(function() {
  const loginForm = document.getElementById('loginForm');
  const loginTitle = document.getElementById('loginTitle');
  const msg = document.getElementById('msg');
  const registerLink = document.querySelector('.register-link a');
  const submitBtn = loginForm.querySelector('.btn');
  const registerOnlyFields = document.querySelectorAll('.register-only');
  const credentialType = document.getElementById('credentialType');
  const passwordInput = document.getElementById('password');
  const statusIndicator = document.querySelector('.status-indicator');
  const profileView = document.getElementById('view-perfil');
  const profileName = document.getElementById('profileName');
  const profileFirstName = document.getElementById('profileFirstName');
  const profileLastName = document.getElementById('profileLastName');
  const btnProfile = document.getElementById('btnProfile');

  let isRegisterMode = false;
  let currentUser = null;
  const API_BASE_URL = 'http://localhost:8080';

  function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.hidden = true);
    document.getElementById(viewId).hidden = false;
  }

  function updateLoginStatus(user) {
    currentUser = user;
    if (user) {
      statusIndicator.classList.remove('offline');
      statusIndicator.classList.add('online');
      profileName.textContent = `${user.firstName} ${user.lastName}`;
      profileFirstName.value = user.firstName;
      profileLastName.value = user.lastName;
    } else {
      statusIndicator.classList.remove('online');
      statusIndicator.classList.add('offline');
      profileView.hidden = true;
    }
  }

  function toggleMode(e) {
    if (e) e.preventDefault();
    isRegisterMode = !isRegisterMode;

    loginTitle.textContent = isRegisterMode ? 'Register' : 'Login';
    submitBtn.textContent = isRegisterMode ? 'Create Account' : 'Login';

    registerOnlyFields.forEach(field => {
      field.hidden = !isRegisterMode;
    });

    if (isRegisterMode) {
      passwordInput.placeholder = 'Password';
      passwordInput.minLength = 6;
      passwordInput.pattern = '';
    }
  }

  credentialType.addEventListener('change', () => {
    if (credentialType.value === 'pin') {
      passwordInput.placeholder = 'PIN (4-8 digits)';
      passwordInput.minLength = 4;
      passwordInput.maxLength = 8;
      passwordInput.pattern = '\\d{4,8}';
    } else {
      passwordInput.placeholder = 'Password';
      passwordInput.minLength = 6;
      passwordInput.maxLength = '';
      passwordInput.pattern = '';
    }
  });

  registerLink.addEventListener('click', (e) => {
    msg.textContent = '';
    toggleMode(e);
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = 'Procesando...'; // Provide feedback
    const username = loginForm.username.value;
    const password = loginForm.password.value;
    const firstName = loginForm.firstName.value;
    const lastName = loginForm.lastName.value;
    const credType = credentialType.value;

    const url = isRegisterMode ? `${API_BASE_URL}/api/register` : `${API_BASE_URL}/api/login`;
    const body = isRegisterMode ?
      { username, password, firstName, lastName, credentialType: credType } :
      { username, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const result = await response.json();

      if (response.ok) {
        if (!isRegisterMode) {
          msg.textContent = "Login exitoso";
          const user = { username, firstName: 'Test', lastName: 'User' };
          updateLoginStatus(user);
          setTimeout(() => {
            document.getElementById('loginModal').classList.remove('open');
            msg.textContent = '';
          }, 500);
        } else {
          toggleMode(); // Switch to login view after successful registration
          msg.textContent = result.message;
        }
      } else {
        msg.textContent = result.message;
      }
    } catch (error) {
      msg.textContent = 'Error de conexión con el servidor.';
    }
  });

  btnProfile.addEventListener('click', () => {
    if (currentUser) {
      showView('view-perfil');
    } else {
      document.getElementById('loginModal').classList.add('open');
      msg.textContent = '';
    }
  });

  document.querySelector('.nav-item[data-view="salir"]').addEventListener('click', (e) => {
    e.preventDefault();
    updateLoginStatus(null);
    showView('view-inicio');
  });

  console.log('Auth script loaded');
})();
