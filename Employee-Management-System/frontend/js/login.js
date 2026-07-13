const API_BASE_URL = 'http://localhost:5001';
const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!loginForm.checkValidity()) {
    loginForm.classList.add('was-validated');
    return;
  }

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!response.ok) {
      alert(data.error || 'Login failed');
      return;
    }

    localStorage.setItem('employeeAdminToken', data.data.token);
    localStorage.setItem('employeeAdminName', data.data.name);
    window.location.href = '../pages/dashboard.html';
  } catch (error) {
    console.error('Login error:', error);
    alert('Unable to login. Please try again later.');
  }
});
