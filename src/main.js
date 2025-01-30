import axios from "axios";
import { insertNavbar } from "./components/Navbar";
import { useLocalStorage } from "./hooks/useLocalstorage";
import { handleLogout } from "./components/Logout";

insertNavbar("navbar", "logo.png");

const navBar = document.querySelector("#navbar");
handleLogout(navBar);

// --------------------------------------------- -- //

const categories = document.getElementById("categories-container");
const products = document.getElementById("products-container");
const cartContainer = document.getElementById("cart-container");

// ------------------------------------------------------- //

// Fetch all categories
const fetchCategories = async () => {
  try {
    const { data } = await axios.get(
      `/api/components/routes/categories/categories.php`
    );
    // console.log(data.data);
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
      data?.data.forEach((product) => {
        const productElement = document.createElement("div");
        productElement.classList.add("product");
        productElement.innerHTML = `
          <div class="img-div">
          <img src="/api/uploaded_files/${product.image}" alt="${product.name}" />
          </div>
          <h3 class="product-name">${product.name}</h3>
          <div class="bottom-content">
          <p class="product-price">Rs.${product.price}</p>
          <button class="add-cart">Add</button>
          </div>
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

// Example output: "k9F3jDpQ7rT2wXyZ1BnL"

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
          <p>${product.price}</p>
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
    const productPrice = productElement.children[2].children[0].textContent;
    const product = {
      id: generateSecureUID(),
      name: productName,
      price: productPrice,
    };
    // Use the returned updated cart from setCart
    const newCart = setCart((prevData) => [product, ...prevData]);
    cartProducts = newCart;
    renderCart(newCart); // Render with the latest data
    setTotalAmount(newCart);
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
  }
});

// set total amount
const setTotalAmount = (cartData) => {
  totalAmount = 0;
  totalAmountElement.textContent = 0;
  cartData.forEach((product) => {
    const price = parseInt(product.price.replace("Rs.", ""));
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
const orderForm = document.querySelector("#order-form form");

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
    }
  } catch {
    (e) => console.log(e);
  }
});

// ----------------------------------------------- //

customerName.addEventListener("change", (e) => {
  if (e.target.value === "authpage") {
    window.location.href = "/src/pages/Auth/login.html";
  }
});
