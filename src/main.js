import axios from "axios";
import { inserSideBar, insertNavbar } from "./components/Navbar";
import { useLocalStorage } from "./hooks/useLocalstorage";
import { handleLogout } from "./components/Logout";
import "remixicon/fonts/remixicon.css";
import { handleSideBar } from "./components/HandleSideBar";

insertNavbar("navbar", "logo.png");
inserSideBar("side-bar");
handleSideBar("navbar", "side-close-btn");

const navBar = document.querySelector("#navbar");
handleLogout(navBar);

const cartCountEle = document.querySelector(".cart-count");

if (cartCountEle) {
  cartCountEle.textContent = JSON.parse(localStorage.getItem("cart")).length;
}

// --------------------------------------------- -- //

const categories = document.getElementById("categories-container");
const products = document.getElementById("products-container");
const cartContainer = document.getElementById("cart-container");
let activeCategory = "";

// Fetch all categories
const fetchCategories = async () => {
  try {
    const { data } = await axios.get(
      `/api/components/routes/categories/categories.php`
    );
    if (data?.success) {
      data?.data.forEach((category) => {
        const categoryElement = document.createElement("span");
        categoryElement.textContent = category.name;
        categories.appendChild(categoryElement);
      });
    } else {
      console.log("error");
    }
  } catch {
    (e) => {
      console.log(e);
    };
  }
};

fetchCategories();

// -----------------------------------------------------  //

// Fetch all products
const fetchProducts = async () => {
  try {
    const { data } = await axios.get(
      `/api/components/routes/products/products.php`
    );
    if (data?.success) {
      const filteredData = data?.data.filter((product) =>
        product.category.includes(activeCategory)
      );
      filteredData.forEach((product) => {
        const productElement = document.createElement("div");
        productElement.classList.add("product");
        productElement.innerHTML = `
          <div class="img-div">
          <img src="/api/uploaded_files/${product.image}" alt="${
          product.name
        }" />
          </div>
          <h3 class="product-name">${product.name}</h3>
          ${
            product.price_type === "single"
              ? `
            <div class="full-price-content">
          <p class="product-price">Rs.${product.full_price}</p>
          <button class="add-cart">Add</button>
          </div>
            `
              : `
              <div class="half-price-content">
          <p class="product-price"><span>Half</span> Rs.${product.half_price}</p>
          <button class="add-cart">Add</button>
          </div>
          <div class="full-price-content">
          <p class="product-price"><span>Full</span> Rs.${product.full_price}</p>
          <button class="add-cart">Add</button>
          </div>
              `
          }
          
        `;
        products.appendChild(productElement);
      });
    } else {
      console.log("error");
    }
  } catch {
    (e) => {
      console.log(e);
    };
  }
};

fetchProducts();

// -------------------------------------------------- //

categories.addEventListener("click", (e) => {
  if (e.target.tagName === "SPAN") {
    if (e.target.textContent === `सभी`) {
      activeCategory = "";
    } else {
      activeCategory = e.target.textContent;
    }
    products.innerHTML = "";
    fetchProducts();
  }
});

// --------------------------------------------------------- //
const totalAmountElement = document.querySelector(".total-amount span");
let totalAmount = 0;

// cart functionality
function generateSecureUID(length = 20) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues); // Browser/Node.js crypto API
  return Array.from(randomValues, (val) => chars[val % chars.length]).join("");
}

const [cart, setCart] = useLocalStorage("cart", []);
let cartProducts = JSON.parse(localStorage.getItem("cart"));

const renderCart = (cartData) => {
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
};

renderCart(cart); // Initial render

products.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-cart")) {
    const productElement = e.target.closest(".product");
    const productName =
      productElement.querySelector(".product-name").textContent;
    const halfPrice = productElement.children[2].children[0].textContent;
    let fullPrice = halfPrice;
    let priceType = "single";
    if (productElement.children.length > 3) {
      fullPrice = productElement.children[3].children[0].textContent;
      priceType = "both";
    }
    let product = {
      id: generateSecureUID(),
      name: productName,
      price_type: priceType,
    };
    if (e.target.parentNode.classList.contains("full-price-content")) {
      product = { ...product, full_price: fullPrice };
    } else {
      product = { ...product, half_price: halfPrice };
    }
    // Use the returned updated cart from setCart
    const newCart = setCart((prevData) => [product, ...prevData]);
    cartProducts = newCart;
    renderCart(newCart); // Render with the latest data
    setTotalAmount(newCart);
    cartCountEle.textContent = newCart.length;
  }
});

cartContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-cart")) {
    const productElement = e.target.closest(".cart-product");
    const productId = productElement.children[0].getAttribute("data-id");
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = currentCart.filter(
      (product) => product.id !== productId
    );
    cartProducts = updatedCart;

    // Use the returned updated cart from setCart
    const newCart = setCart(updatedCart);
    renderCart(newCart); // Render with the latest data
    setTotalAmount(newCart);
    cartCountEle.textContent = newCart.length;
  }
});

// set total amount
const setTotalAmount = (cartData) => {
  totalAmount = 0;
  totalAmountElement.textContent = 0;
  cartData.forEach((product) => {
    let price = product.half_price ? product.half_price : product.full_price;
    price = parseInt(price.substring(price.length - 3, price.length));
    totalAmount += price;
  });
  totalAmountElement.textContent = totalAmount;
  return totalAmount;
};
setTotalAmount(cart);

// --------------------------------------------------------- //
// place order

const proceedBtn = document.querySelector("#confirm-order");
const orderFormContainer = document.querySelector(".order-form");

const customerName = document.querySelector("#customer-name");
const customerPhone = document.querySelector("#phone-number");
const customerAddress = document.querySelector("#order-address");
const orderBtn = document.querySelector("#order-submit-btn");

proceedBtn.addEventListener("click", (e) => {
  orderFormContainer.style.display = "flex";
});
orderFormContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("order-form")) {
    orderFormContainer.style.display = "none";
  }
});
orderBtn.addEventListener("click", async (e) => {
  const products = cartProducts;
  const address = customerAddress.value;
  const buyer = customerName.value;
  const phone = customerPhone.value;
  const total = `${setTotalAmount(cartProducts)}`;

  const orderData = {
    products,
    address,
    buyer,
    phone,
    total,
  };

  try {
    const { data } = await axios.post(
      "/api/components/routes/orders/create.php",
      orderData
    );
    if (data.success) {
      orderFormContainer.style.display = "none";
      const clearCart = setCart([]);
      renderCart(clearCart);
      window.location.href = "https://wa.link/7dnmxx";
    }
  } catch {
    (e) => console.log(e);
  }
});

// ----------------------------------------------- //

if (localStorage.getItem("customerName")) {
  customerName.value = localStorage.getItem("customerName");
}
if (localStorage.getItem("customerPhone")) {
  customerPhone.value = localStorage.getItem("customerPhone");
}
if (localStorage.getItem("customerAddress")) {
  customerAddress.value = localStorage.getItem("customerAddress");
}

customerName.addEventListener("change", (e) => {
  if (e.target.value === "authpage") {
    window.location.href = "/src/pages/Auth/login.html";
  }
  localStorage.setItem("customerName", e.target.value);
});
customerPhone.addEventListener("change", (e) => {
  if (e.target.value === "authpage") {
    window.location.href = "/src/pages/Auth/login.html";
  }
  localStorage.setItem("customerPhone", e.target.value);
});
customerAddress.addEventListener("change", (e) => {
  if (e.target.value === "authpage") {
    window.location.href = "/src/pages/Auth/login.html";
  }
  localStorage.setItem("customerAddress", e.target.value);
});
