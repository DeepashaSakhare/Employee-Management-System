const API_BASE_URL = 'http://localhost:5001';
const token = localStorage.getItem('employeeAdminToken');
const adminName = localStorage.getItem('employeeAdminName');

if (!token) {
  if (!window.location.pathname.endsWith('login.html') && !window.location.pathname.endsWith('index.html')) {
    window.location.href = 'login.html';
  }
}

const adminNameEl = document.getElementById('adminName');
if (adminNameEl) {
  adminNameEl.textContent = adminName || 'Admin';
}

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('employeeAdminToken');
    localStorage.removeItem('employeeAdminName');
    window.location.href = 'login.html';
  });
}

const showToast = (message, type = 'primary') => {
  const toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container p-3';
  toastContainer.innerHTML = `
    <div class="toast align-items-center text-bg-${type} border-0 show" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;
  document.body.appendChild(toastContainer);
  setTimeout(() => toastContainer.remove(), 4000);
};

const fetchEmployeesList = async (searchTerm = '') => {
  try {
    const url = new URL(`${API_BASE_URL}/api/employees`);
    if (searchTerm) url.searchParams.set('search', searchTerm);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Unable to fetch employees');
    }

    const employeeTableBody = document.getElementById('employeeTableBody');
    if (!employeeTableBody) return;

    employeeTableBody.innerHTML = data.data.map((employee) => `
      <tr>
        <td>${employee.employeeId}</td>
        <td>${employee.fullName}</td>
        <td>${employee.email}</td>
        <td>${employee.department}</td>
        <td><span class="badge bg-${employee.status === 'Active' ? 'success' : 'secondary'}">${employee.status}</span></td>
        <td>
          <button class="btn btn-sm btn-info me-1" onclick="viewEmployee('${employee._id}')"><i class="bi bi-eye"></i></button>
          <button class="btn btn-sm btn-warning me-1" onclick="editEmployee('${employee._id}')"><i class="bi bi-pencil-square"></i></button>
          <button class="btn btn-sm btn-danger" onclick="deleteEmployee('${employee._id}')"><i class="bi bi-trash"></i></button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Employee list error:', error);
    showToast('Unable to load employees.', 'danger');
  }
};

window.viewEmployee = (id) => {
  window.location.href = `employeeDetails.html?id=${id}`;
};

window.editEmployee = (id) => {
  window.location.href = `editEmployee.html?id=${id}`;
};

window.deleteEmployee = async (id) => {
  if (!confirm('Are you sure you want to delete this employee?')) return;

  try {
    const response = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Delete failed');
    }

    showToast('Employee deleted successfully.', 'success');
    fetchEmployeesList(document.getElementById('searchInput')?.value || '');
  } catch (error) {
    console.error('Delete error:', error);
    showToast('Unable to delete employee.', 'danger');
  }
};

const handleEmployeeFormSubmit = async (event, isEdit = false, employeeId = '') => {
  event.preventDefault();
  const form = event.target;

  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return;
  }

  const employeeData = {
    fullName: document.getElementById('fullName').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    department: document.getElementById('department').value.trim(),
    designation: document.getElementById('designation').value.trim(),
    salary: Number(document.getElementById('salary').value),
    joiningDate: document.getElementById('joiningDate').value,
    gender: document.getElementById('gender').value,
    address: document.getElementById('address').value.trim(),
    status: document.getElementById('status').value
  };

  try {
    const url = isEdit
      ? `${API_BASE_URL}/api/employees/${employeeId}`
      : `${API_BASE_URL}/api/employees`;
    const method = isEdit ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(employeeData)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Save failed');
    }

    showToast(`Employee ${isEdit ? 'updated' : 'created'} successfully.`, 'success');
    window.location.href = 'employees.html';
  } catch (error) {
    console.error('Save employee error:', error);
    showToast(error.message || 'Failed to save employee.', 'danger');
  }
};

const loadEmployeeData = async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) {
    showToast('Employee ID missing.', 'danger');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Unable to load employee');
    }

    const employee = data.data;
    document.getElementById('employeeId').value = employee._id;
    document.getElementById('fullName').value = employee.fullName;
    document.getElementById('email').value = employee.email;
    document.getElementById('phone').value = employee.phone;
    document.getElementById('department').value = employee.department;
    document.getElementById('designation').value = employee.designation;
    document.getElementById('salary').value = employee.salary;
    document.getElementById('joiningDate').value = employee.joiningDate.slice(0, 10);
    document.getElementById('gender').value = employee.gender;
    document.getElementById('address').value = employee.address;
    document.getElementById('status').value = employee.status;
  } catch (error) {
    console.error('Load employee error:', error);
    showToast('Unable to load employee details.', 'danger');
  }
};

const loadEmployeeDetails = async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) {
    showToast('Employee ID missing.', 'danger');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Unable to load employee');
    }

    const employee = data.data;
    const detailsContainer = document.getElementById('employeeDetails');
    if (!detailsContainer) return;

    detailsContainer.innerHTML = `
      <div class="col-md-6">
        <h6>Employee ID</h6>
        <p>${employee.employeeId}</p>
      </div>
      <div class="col-md-6">
        <h6>Full Name</h6>
        <p>${employee.fullName}</p>
      </div>
      <div class="col-md-6">
        <h6>Email</h6>
        <p>${employee.email}</p>
      </div>
      <div class="col-md-6">
        <h6>Phone</h6>
        <p>${employee.phone}</p>
      </div>
      <div class="col-md-6">
        <h6>Department</h6>
        <p>${employee.department}</p>
      </div>
      <div class="col-md-6">
        <h6>Designation</h6>
        <p>${employee.designation}</p>
      </div>
      <div class="col-md-6">
        <h6>Salary</h6>
        <p>$${employee.salary.toLocaleString()}</p>
      </div>
      <div class="col-md-6">
        <h6>Joining Date</h6>
        <p>${new Date(employee.joiningDate).toLocaleDateString()}</p>
      </div>
      <div class="col-md-6">
        <h6>Gender</h6>
        <p>${employee.gender}</p>
      </div>
      <div class="col-md-6">
        <h6>Status</h6>
        <p><span class="badge bg-${employee.status === 'Active' ? 'success' : 'secondary'}">${employee.status}</span></p>
      </div>
      <div class="col-12">
        <h6>Address</h6>
        <p>${employee.address}</p>
      </div>
    `;
  } catch (error) {
    console.error('Load employee details error:', error);
    showToast('Unable to load employee details.', 'danger');
  }
};

if (window.location.pathname.endsWith('employeeDetails.html')) {
  loadEmployeeDetails();
}

if (document.getElementById('employeeTableBody')) {
  fetchEmployeesList();
  document.getElementById('searchInput').addEventListener('input', (event) => {
    fetchEmployeesList(event.target.value.trim());
  });
  document.getElementById('addEmployeeBtn').addEventListener('click', () => {
    window.location.href = 'addEmployee.html';
  });
}

const employeeForm = document.getElementById('employee-form');
if (employeeForm) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (id) {
    loadEmployeeData();
    employeeForm.addEventListener('submit', (event) => handleEmployeeFormSubmit(event, true, id));
  } else {
    employeeForm.addEventListener('submit', (event) => handleEmployeeFormSubmit(event, false));
  }
}
