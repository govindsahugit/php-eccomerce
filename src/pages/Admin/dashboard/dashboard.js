export function dashboardJS() {
  if (!JSON.parse(localStorage.getItem("user"))) {
    document.querySelector(".main-content").innerHTML =
      "<h1>You are not authorized to view this page</h1>";
    alert("You are not authorized to view this page");
    window.location.href = "/";
  }
  const nameSpan = document.querySelector(".main-content #name");
  const userData = JSON.parse(localStorage.getItem("user"));
  nameSpan.innerHTML = userData?.name;
}

export function dashboardPage() {
  return `
  <br />
    <div class="dashboard">
      <h1>Admin Panel</h1>
      <main class="main-content">
        <h1>Welcome <span id="name"></span> to the Admin Dashboard</h1>
        <ul class="dashboard-links">
          <li>
            <a
              href="/dashboard/categories"
              id="categories-link"
              data-navigo
              >Categories</a
            >
          </li>
          <li>
            <a href="/dashboard/products" id="products-link" data-navigo
              >Products</a
            >
          </li>
          <li>
            <a href="/dashboard/orders" id="orders-link" data-navigo
              >Orders</a
            >
          </li>
          <li>
            <a
              href="/dashboard/histories" data-navigo
              id="history-link"
              >Order History</a
            >
          </li>
          <li>
            <a href="/dashboard/users" data-navigo id="users-link"
              >Users</a
            >
          </li>
        </ul>
      </main>
    </div>
    <!-- <script type="module" src="dashboard.js"></script> -->
  `;
}
