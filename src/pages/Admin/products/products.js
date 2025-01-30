import axios from "axios";
import { insertNavbar } from "../../../components/Navbar.js";
import { handleLogout } from "../../../components/Logout.js";

insertNavbar("navbar", "/logo.png");
handleLogout(document.querySelector("#navbar"));

const currentUser = JSON.parse(localStorage.getItem("user"));
const mainContainer = document.querySelector(".container");
const createContainer = document.querySelector("#create-product");
const updateContainer = document.querySelector("#update-product");
let productId = "";

// console.log(mainContainer);

if (JSON.parse(localStorage.getItem("user")).role !== 2) {
  mainContainer.innerHTML = `<h1>You are not authorized to view this page</h1>`;
}

// Fetch categories
const fetchCategories = async (selectId) => {
  try {
    const response = await axios.get(
      "/api/components/routes/categories/categories.php"
    );
    const data = response.data;
    if (data?.success) {
      const select = document.getElementById(selectId);
      data?.data.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.name;
        option.textContent = category.name;
        select.appendChild(option);
      });
    } else {
      console.log(data?.message);
    }
  } catch {
    console.error("Error fetching categories:");
  }
};
fetchCategories("category");
fetchCategories("category-upt");

// Fetch products from API
const fetchProducts = async () => {
  try {
    const response = await axios.get(
      "/api/components/routes/products/products.php"
    );
    const data = response.data;
    if (data?.success) {
      localStorage.setItem("products", JSON.stringify(data.data));
      const productsList = document.getElementById("products-list");
      productsList.innerHTML = ""; // Clear previous data
      // Loop through the products and display each one in a card
      data?.data.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.innerHTML = `
            <div class="img-card">
            <img src="/api/uploaded_files/${product.image}" alt="${product.name}">
            </div>
            <h3>${product.name}</h3>
            <p>Rs.${product.price}</p> 
            <div>
            <span class="update-btn" data-id="${product.id}">Update</span>
            <button class="delete-btn" data-id="${product.id}">Delete</button>
            </div>
          `;
        productsList.appendChild(productCard);
      });
    } else {
      console.log(data?.message);
    }
  } catch {
    console.error("Error fetching products:");
  }
};
// On page load, fetch the products
fetchProducts();

// create image preview
const imgPreview = document.querySelector("#create-preview-img");
const createImgInput = document.querySelector("#imageInput");
createImgInput.addEventListener("change", (e) => {
  imgPreview.style.display = "inline-block";
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    document.querySelector("#create-preview-img").src = e.target.result;
  };
  reader.readAsDataURL(file);
});

// Create Products
const createForm = document.getElementById("create-product-form");
createForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  // Collect form data
  const formData = new FormData(createForm);
  try {
    // Send POST request
    const { data } = await axios.post(
      `/api/components/routes/products/create.php?aid=${
        JSON.parse(localStorage.getItem("user")).id
      }`,
      formData
    );
    // Handle the response
    if (data?.success) {
      createForm.reset();
      imgPreview.style.display = "none";
      fetchProducts();
    } else {
      console.log(`Error: ${data?.message}`);
    }
  } catch {
    console.error("Error creating product:");
  }
});

// Update Products
const updateForm = document.getElementById("update-product-form");

document.querySelector(".products-list").addEventListener("click", (e) => {
  if (e.target.classList.contains("update-btn")) {
    createContainer.style.display = "none";
    updateContainer.style.display = "block";
    const dataId = e.target.getAttribute("data-id");
    productId = dataId;
    const products = JSON.parse(localStorage.getItem("products"));
    const product = products.find((product) => product.id == dataId);
    updateForm[0].value = product.name;
    updateForm[1].value = product.price;
    const options = Array.from(updateForm[2].children);
    const categoryName = JSON.parse(localStorage.getItem("products")).find(
      (product) => product.id == dataId
    ).category;
    options.forEach((option) => {
      if (option.textContent === categoryName) {
        option.selected = true;
      }
    });
    document.querySelector(
      "#preview-img"
    ).src = `/api/uploaded_files/${product.image}`;
    updateForm[3].addEventListener("change", (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        document.querySelector("#preview-img").src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }
});

const imgInputContainer = document.querySelector(".img-input");
const imgInput = document.querySelector(".img-input input");
const imgSpan = document.querySelector(".img-input span");
imgInputContainer.addEventListener("click", () => {
  if (imgSpan.style.display !== "none") {
    imgInput.style.display = "block";
    imgSpan.style.display = "none";
    imgInput.click();
  }
});

updateForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  // Collect form data
  const formData = new FormData(updateForm);
  try {
    // Send POST request
    const { data } = await axios.post(
      `/api/components/routes/products/update.php?aid=${
        JSON.parse(localStorage.getItem("user")).id
      }&productid=${productId}`,
      formData
    );
    console.log(data);
    // Handle the response
    if (data?.success) {
      updateForm.reset();
      createContainer.style.display = "block";
      updateContainer.style.display = "none";
      imgInput.style.display = "none";
      imgSpan.style.display = "inline-block";
      productId = "";
      fetchProducts();
    } else {
      console.log(data?.message);
    }
  } catch {
    console.error("Error updating product:");
  }
});

// Delete Product
document
  .querySelector(".products-list")
  .addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const dataId = e.target.getAttribute("data-id");
      try {
        // Send DELETE request
        const { data } = await axios.delete(
          `/api/components/routes/products/delete.php?aid=${
            JSON.parse(localStorage.getItem("user")).id
          }&productid=${dataId}`
        );
        // Handle the response
        if (data?.success) {
          fetchProducts();
        } else {
          console.log(data?.message);
        }
      } catch {
        console.error("Error deleting product:");
      }
    }
  });
