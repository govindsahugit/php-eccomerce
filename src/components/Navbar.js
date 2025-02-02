import gsap from "gsap";
import "remixicon/fonts/remixicon.css";

// Navbar.js
export function insertNavbar(targetId, imgPath) {
  const navbarHTML = `
        <div class="nav-left">
          <img src="${imgPath}" alt="Logo" class="logo" />
          <h1 class="heading">साहू ढाबा</h1>
        </div>
        <div class="nav-right">
          <ul class="nav-links">
          ${
            JSON.parse(localStorage.getItem("user")).role > 0
              ? `
            <li><a href="/">HOME</a></li>
              <li>
              <a href="/src/pages/Admin/dashboard/dashboard.html">ADMIN</a>
            </li>
            <li>
              <a class="logout-btn" href="#">LOGOUT</a> 
            </li>
                `
              : ""
          }
          </ul>
        </div>
        ${
          JSON.parse(localStorage.getItem("user"))?.role > 0
            ? `
          <button class="menu-toggle" aria-label="Toggle menu">&#9776;</button>
          `
            : `
            <span class="mobile-only" id="cart-toggle">
  🛒Cart(${JSON.parse(localStorage.getItem("cart")).length})
</span>
            `
        }
    `;

  const targetElement = document.getElementById(targetId);
  targetElement.addEventListener("click", function (e) {
    if (e.target.classList.contains("heading")) {
      window.location.href = "/";
      return;
    }
    if (e.target.classList.contains("mobile-only")) {
      if (e.target.textContent.substring(5, 9) === "Cart") {
        e.target.innerHTML = "";
        gsap.to("#cart-container-wrapper", {
          transform: "translateX(0%)",
        });
        gsap.to("#place-order-ele", {
          transform: "translateX(-10%)",
        });
        e.target.innerHTML = `<i class="ri-close-large-fill mobile-only"></i>`;
        // e.target.style.fontSize = "1.5rem";
      } else {
        gsap.to("#cart-container-wrapper", {
          transform: "translateX(100%)",
        });
        gsap.to("#place-order-ele", {
          transform: "translateX(-100%)",
        });
        e.target.parentNode.innerHTML = `<span class="mobile-only" id="cart-toggle">
  🛒Cart(${JSON.parse(localStorage.getItem("cart")).length})
</span>`;
        // e.target.parentNode.style.fontSize = "1rem";
      }
    }
  });

  if (targetElement) {
    targetElement.innerHTML = navbarHTML;
  } else {
    console.error(`Element with id "${targetId}" not found.`);
  }
}
