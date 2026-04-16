

function togglePanel(panel) {
  document.getElementById('panel-login').style.display = panel === 'login' ? 'block' : 'none';
  document.getElementById('panel-register').style.display = panel === 'register' ? 'block' : 'none';
  document.getElementById('tab-login').classList.toggle('active', panel === 'login');
  document.getElementById('tab-register').classList.toggle('active', panel === 'register');
}

function showToast(message) {
  var toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(function () { toast.classList.remove('show'); }, 2800);
}

function validateEmail(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

async function handleLogin(event) {
  event.preventDefault();
  var email = document.getElementById('email-login').value.trim();
  var password = document.getElementById('password-login').value;
  var emailError = document.getElementById('login-email-error');
  var passError = document.getElementById('login-pass-error');
  var valid = true;

  emailError.style.display = 'none';
  passError.style.display = 'none';

  if (!validateEmail(email)) {
    emailError.style.display = 'block';
    valid = false;
  }
  if (!password) {
    passError.style.display = 'block';
    valid = false;
  }

  if (!valid) return;

  try {
    var response = await fetch('http://127.0.0.1:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password }),
    });
    var result = await response.json();

    if (response.ok) {
      showToast(result.message || 'Ingreso exitoso.');
    } else {
      showToast(result.error || 'Error en el ingreso.');
    }
  } catch (error) {
    console.error(error);
    showToast('No se pudo conectar al servidor.');
  }
}

async function handleRegister(event) {
  event.preventDefault();
  var id = document.getElementById('id-register').value.trim();
  var nombre = document.getElementById('nombre-register').value.trim();
  var grupo = document.getElementById('grupo-register').value.trim();
  var especialidad = document.getElementById('especialidad-register').value;
  var horario = document.getElementById('horario-register').value;

  var idErr = document.getElementById('register-id-error');
  var nombreErr = document.getElementById('register-nombre-error');
  var grupoErr = document.getElementById('register-grupo-error');
  var especialidadErr = document.getElementById('register-especialidad-error');
  var horarioErr = document.getElementById('register-horario-error');
  var valid = true;

  idErr.style.display = 'none';
  nombreErr.style.display = 'none';
  grupoErr.style.display = 'none';
  especialidadErr.style.display = 'none';
  horarioErr.style.display = 'none';

  if (!id) { idErr.style.display = 'block'; valid = false; }
  if (!nombre) { nombreErr.style.display = 'block'; valid = false; }
  if (!grupo) { grupoErr.style.display = 'block'; valid = false; }
  if (!especialidad) { especialidadErr.style.display = 'block'; valid = false; }
  if (!horario) { horarioErr.style.display = 'block'; valid = false; }

  if (!valid) return;

  try {
    var response = await fetch('http://127.0.0.1:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id, nombre: nombre, grupo: grupo, especialidad: especialidad, horario: horario }),
    });
    var result = await response.json();

    if (response.ok) {
      showToast(result.message || 'Registro guardado correctamente.');
      document.getElementById('id-register').value = '';
      document.getElementById('nombre-register').value = '';
      document.getElementById('grupo-register').value = '';
      document.getElementById('especialidad-register').value = '';
      document.getElementById('horario-register').value = '';
    } else {
      showToast(result.error || 'Error en el registro.');
    }
  } catch (error) {
    console.error(error);
    showToast('No se pudo conectar al servidor.');
  }
}
