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
            JSON.parse(localStorage.getItem("user"))?.role > 0
              ? `
            <li><a href="/" data-navigo>HOME</a></li>
              <li>
              <a href="/dashboard" data-navigo>ADMIN</a>
            </li>
            <li>
              <a class="logout-btn">LOGOUT</a> 
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
  🛒Cart(<span class="cart-count">${
    JSON.parse(localStorage.getItem("cart"))?.length
      ? JSON.parse(localStorage.getItem("cart"))?.length
      : 0
  }</span>)
</span>
            `
        }
    `;

  const targetElement = document.getElementById(targetId);
  targetElement?.addEventListener("click", function (e) {
    if (e.target.classList.contains("heading")) {
      window.location.href = "/";
      return;
    }
    if (e.target.classList.contains("mobile-only")) {
      if (e.target.textContent.substring(5, 9) === "Cart") {
        gsap.to("#cart-container-wrapper", {
          transform: "translateX(0%)",
        });
        gsap.to(".close-btn", {
          transform: "translateX(0%)",
        });
      }
    }
  });

  const closeBtn = document.querySelector("#app");
  closeBtn?.addEventListener("click", (e) => {
    if (e.target.classList.contains("ri-close-large-line")) {
      gsap.to("#cart-container-wrapper", {
        transform: "translateX(100%)",
      });
      gsap.to(".close-btn", {
        transform: "translateX(100%)",
      });
    }
  });

  if (targetElement) {
    targetElement.innerHTML = navbarHTML;
  } else {
    console.error(`Element with id "${targetId}" not found.`);
  }
}

export function inserSideBar(targetId) {
  const sideBarHTML = `
  <div id="side-close-btn">
        <i class="ri-close-large-line"></i>
      </div>
      <div class="side-links">
        <a data-navigo href="/">HOME</a>
        <a class="side-cart">CART(<span class="cart-count">${
          JSON.parse(localStorage.getItem("cart"))?.length
            ? JSON.parse(localStorage.getItem("cart"))?.length
            : 0
        }</span>)</a>
        <a href="/dashboard" data-navigo>ADMIN</a>
        <a class="logout-btn">LOGOUT</a>
      </div>
  `;

  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    targetElement.innerHTML = sideBarHTML;
  } else {
    console.error(`Element with id "${targetId}" not found.`);
  }
  targetElement.addEventListener("click", (e) => {
    if (e.target.classList.contains("side-cart")) {
      gsap.to("#side-bar", {
        transform: "translateX(100%)",
      });
      gsap.to("#cart-container-wrapper", {
        transform: "translateX(0%)",
      });
      gsap.to(".close-btn", {
        transform: "translateX(0%)",
      });
    }
    if (e.target.classList.contains("logout-btn")) {
      localStorage.removeItem("user");
      window.location.href = "/src/pages/Auth/login.html";
    }
  });
}
