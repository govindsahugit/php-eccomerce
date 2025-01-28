// Navbar.js
export function insertNavbar(targetId, imgPath) {
  const navbarHTML = `
        <div class="nav-left">
          <img src="${imgPath}" alt="Logo" class="logo" />
          <h1 class="heading">My Website</h1>
        </div>
        <div class="nav-right">
          <ul class="nav-links">
            <li><a href="/">HOME</a></li>
            <li>
              <a href="/src/pages/Admin/dashboard/dashboard.html">ADMIN</a>
            </li>
            <li><a id="logout-btn" href="#">LOGOUT</a></li>
          </ul>
        </div>
        <button class="menu-toggle" aria-label="Toggle menu">&#9776;</button>
    `;

  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    targetElement.innerHTML = navbarHTML;
  } else {
    console.error(`Element with id "${targetId}" not found.`);
  }
}
