import gsap from "gsap";

export function handleSideBar(targetId, closeId) {
  const targetElement = document.getElementById(targetId);
  const closeBtn = document.getElementById(closeId);
  const sideLinks = document.querySelectorAll(".side-link");
  Array.from(sideLinks).forEach((link) => {
    link.addEventListener("click", (e) => {
      gsap.to("#side-bar", {
        transform: "translateX(100%)",
      });
    });
  });
  targetElement?.addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-toggle")) {
      gsap.to("#side-bar", {
        transform: "translateX(0%)",
      });
    }
  });
  closeBtn?.addEventListener("click", (e) => {
    if (e.target.classList.contains("ri-close-large-line")) {
      gsap.to("#side-bar", {
        transform: "translateX(100%)",
      });
    }
  });
}

export function inserSideCart(cartData, containerId) {
  const cartContainer = document.getElementById(containerId);
  cartContainer.innerHTML = "";
  if (cartData.length > 0) {
    cartData.forEach((product) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-product");
      cartItem.innerHTML = `
          <p data-id=${product.id}>${product.name}</p>
          <p>${product.half_price ? product.half_price : product.full_price}</p>
          <button class="remove-cart">Remove</button>
        `;
      cartContainer.appendChild(cartItem);
    });
  } else {
    cartContainer.innerHTML = "<p>Cart is empty</p>";
  }
}

export function renderSideCart(cartData, cartContainer) {
  cartContainer.innerHTML = "";
  if (cartData.length > 0) {
    cartData.forEach((product) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-product");
      cartItem.innerHTML = `
          <p data-id=${product.id}>${product.name}</p>
          <p>${product.half_price ? product.half_price : product.full_price}</p>
        `;
      cartContainer.appendChild(cartItem);
    });
  } else {
    cartContainer.innerHTML = "<p>Cart is empty</p>";
  }
}
