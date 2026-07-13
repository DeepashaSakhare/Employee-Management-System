const API_BASE_URL = 'http://localhost:5001';
const token = localStorage.getItem('employeeAdminToken');
const adminName = localStorage.getItem('employeeAdminName');

if (!token) {
  window.location.href = 'login.html';
}

const adminNameEl = document.getElementById('adminName');
const welcomeNameEl = document.getElementById('welcomeName');
const dashboardCards = document.getElementById('dashboardCards');
const recentEmployeesBody = document.getElementById('recentEmployeesBody');
const logoutBtn = document.getElementById('logoutBtn');

adminNameEl.textContent = adminName || 'Admin';
welcomeNameEl.textContent = adminName || 'Admin';

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('employeeAdminToken');
  localStorage.removeItem('employeeAdminName');
  window.location.href = 'login.html';
});

const fetchEmployees = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/employees`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Unable to fetch employees');
    }

    const employees = data.data;
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter((emp) => emp.status === 'Active').length;
    const departments = [...new Set(employees.map((emp) => emp.department))].length;
    const recentEmployees = employees.slice(0, 5);

    dashboardCards.innerHTML = `
      <div class="col-sm-6 col-xl-3">
        <div class="card dashboard-card p-3 shadow-sm">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <h5>Total Employees</h5>
              <h2>${totalEmployees}</h2>
            </div>
            <i class="bi bi-people-fill fs-1 text-primary"></i>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="card dashboard-card p-3 shadow-sm">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <h5>Active Employees</h5>
              <h2>${activeEmployees}</h2>
            </div>
            <i class="bi bi-person-check-fill fs-1 text-success"></i>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="card dashboard-card p-3 shadow-sm">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <h5>Departments</h5>
              <h2>${departments}</h2>
            </div>
            <i class="bi bi-building fs-1 text-warning"></i>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="card dashboard-card p-3 shadow-sm">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <h5>Recent Employees</h5>
              <h2>${recentEmployees.length}</h2>
            </div>
            <i class="bi bi-clock-history fs-1 text-info"></i>
          </div>
        </div>
      </div>
    `;

    recentEmployeesBody.innerHTML = recentEmployees.map((employee) => `
      <tr>
        <td>${employee.employeeId}</td>
        <td>${employee.fullName}</td>
        <td>${employee.department}</td>
        <td><span class="badge bg-${employee.status === 'Active' ? 'success' : 'secondary'}">${employee.status}</span></td>
        <td>${new Date(employee.joiningDate).toLocaleDateString()}</td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Dashboard fetch error:', error);
    alert('Unable to load dashboard data.');
  }
};

fetchEmployees();
