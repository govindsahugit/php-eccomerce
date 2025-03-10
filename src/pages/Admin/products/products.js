import axios from "axios";

export function ProductsPageJs() {
  const mainContainer = document.querySelector(".container");
  const createContainer = document.querySelector("#create-product");
  const updateContainer = document.querySelector("#update-product");
  let productId = "";

  if (JSON.parse(localStorage.getItem("user"))?.role < 2) {
    mainContainer.innerHTML = `<h1>You are not authorized to view this page</h1>`;
  }

  // Fetch categories
  const fetchCategories = async (selectId) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URI
        }/components/routes/categories/categories.php`
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
        `${
          import.meta.env.VITE_API_URI
        }/components/routes/products/products.php`
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
            <img src="${import.meta.env.VITE_API_URI}/uploaded_files/${
            product.image
          }" alt="${product.name}">
            </div>
            <h3>${product.name}</h3>
            ${
              product.price_type === "single"
                ? `
            <div class="full-price-content">
          <p class="product-price">Rs.${product.full_price}</p>
          </div>
            `
                : `
                <div class="price-container">
              <div class="half-price-content">
          <p class="product-price"><span>Half</span> Rs.${product.half_price}</p>
          </div>
          <div class="full-price-content">
          <p class="product-price"><span>Full</span> Rs.${product.full_price}</p>
          </div>
          </div>
              `
            }
            <div class="action-buttons">
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

  // ------------------------------------------------------- //

  const priceType = document.querySelector("#price-type");
  const halfPrice = document.querySelector("#half-price");
  const fullPrice = document.querySelector("#full-price");

  const priceTypeUpt = document.querySelector("#upt-price-type");
  const halfPriceUpt = document.querySelector("#upt-half-price");
  const fullPriceUpt = document.querySelector("#upt-full-price");

  priceType.addEventListener("change", (e) => {
    if (e.target.value !== "both") {
      halfPrice.parentNode.style.display = "none";
      halfPrice.required = false;
      console.log(halfPrice.parentNode);
      fullPrice.previousElementSibling.textContent = "Price";
    } else {
      halfPrice.parentNode.style.display = "inline-block";
      halfPrice.required = true;
      fullPrice.previousElementSibling.textContent = "Full price";
    }
  });

  priceTypeUpt.addEventListener("change", (e) => {
    if (e.target.value !== "both") {
      halfPriceUpt.parentNode.style.display = "none";
      halfPriceUpt.required = false;
      fullPriceUpt.previousElementSibling.textContent = "Price";
    } else {
      halfPriceUpt.parentNode.style.display = "inline-block";
      halfPriceUpt.required = true;
      fullPriceUpt.previousElementSibling.textContent = "Full price";
    }
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
        `${
          import.meta.env.VITE_API_URI
        }/components/routes/products/create.php?aid=${
          JSON.parse(localStorage.getItem("user"))?.id
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
  const uptHalfPrice = document.querySelector("#upt-half-price");
  const uptFullPrice = document.querySelector("#upt-full-price");

  document.querySelector(".products-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("update-btn")) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      createContainer.style.display = "none";
      updateContainer.style.display = "block";
      const dataId = e.target.getAttribute("data-id");
      productId = dataId;
      const products = JSON.parse(localStorage.getItem("products"));
      const product = products?.find((product) => product.id == dataId);
      updateForm[0].value = product?.name;
      updateForm[1].value = product?.price_type;
      updateForm[2].value = product?.half_price;
      updateForm[3].value = product?.full_price;

      if (product.price_type !== "both") {
        uptHalfPrice.parentNode.style.display = "none";
        uptHalfPrice.required = false;
        uptFullPrice.previousElementSibling.textContent = "Price";
      } else {
        uptHalfPrice.parentNode.style.display = "inline-block";
        uptHalfPrice.required = true;
        uptFullPrice.previousElementSibling.textContent = "Full price";
      }

      const options = Array.from(updateForm[4].children);
      const categoryName = JSON.parse(localStorage.getItem("products"))?.find(
        (product) => product.id == dataId
      ).category;
      options.forEach((option) => {
        if (option.textContent === categoryName) {
          option.selected = true;
        }
      });
      document.querySelector("#preview-img").src = `${
        import.meta.env.VITE_API_URI
      }/uploaded_files/${product.image}`;
      updateForm[5].addEventListener("change", (e) => {
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
        `${
          import.meta.env.VITE_API_URI
        }/components/routes/products/update.php?aid=${
          JSON.parse(localStorage.getItem("user"))?.id
        }&productid=${productId}`,
        formData
      );
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
            `${
              import.meta.env.VITE_API_URI
            }/components/routes/products/delete.php?aid=${
              JSON.parse(localStorage.getItem("user"))?.id
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
}

export function ProductPage() {
  return `
  <br />
    <div class="product-container">
      <div id="create-product">
        <h1>Create New Product</h1>
        <br />
        <form id="create-product-form">
          <div class="form-group">
            <label for="name">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter product name"
              required />
          </div>
          <div class="form-group">
            <label for="category">Select price type</label>
            <select required name="price_type" id="price-type">
              <option value="both">Half and full</option>
              <option value="single">Single</option>
            </select>
          </div>
          <div class="form-group">
            <label for="half-price">Half price</label>
            <input
              type="number"
              id="half-price"
              name="half_price"
              placeholder="Enter product price"
              required />
          </div>
          <div class="form-group">
            <label for="full-price">Full price</label>
            <input
              type="number"
              id="full-price"
              name="full_price"
              placeholder="Enter product price"
              required />
          </div>
          <div class="form-group">
            <label for="category">Select category</label>
            <select required name="category" id="category"></select>
          </div>
          <div class="form-group">
            <label for="image">Product Image</label>
            <input
              type="file"
              id="imageInput"
              name="image"
              accept="image/*"
              required />
            <br />
            <br />
            <img
              src=""
              id="create-preview-img"
              alt="Current Product Image"
              width="300" />
          </div>
          <button type="submit" class="product-submit-btn">Create Product</button>
        </form>
      </div>
      <div id="update-product">
        <h1>Update Product</h1>
        <br />
        <form id="update-product-form">
          <div class="form-group">
            <label for="name">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter product name"
              required />
          </div>
          <div class="form-group">
            <label for="category">Select price type</label>
            <select required name="price_type" id="upt-price-type">
              <option value="both">Half and full</option>
              <option value="single">Single</option>
            </select>
          </div>
          <div class="form-group">
            <label for="upt-half-price">Half price</label>
            <input
              type="number"
              id="upt-half-price"
              name="half_price"
              placeholder="Enter product price"
              required />
          </div>
          <div class="form-group">
            <label for="upt-full-price">Full price</label>
            <input
              type="number"
              id="upt-full-price"
              name="full_price"
              placeholder="Enter product price"
              required />
          </div>
          <div class="form-group">
            <label for="category">Select category</label>
            <select name="category" id="category-upt"></select>
          </div>
          <div class="form-group">
            <label for="image">Product Image</label>
            <br />
            <div class="img-input">
              <span>Change Image</span>
              <input
                type="file"
                id="update-img"
                name="image"
                accept="image/*" />
            </div>
            <br />
            <br />
            <img
              src=""
              id="preview-img"
              alt="Current Product Image"
              width="300" />
          </div>
          <button type="submit" class="product-submit-btn">Update Product</button>
        </form>
      </div>
      <div id="products-list" class="products-list"></div>
    </div>
    <div id="cart-container-wrapper">
          <div id="cart-container"></div>
        </div>
        <div class="close-btn">
          <i class="ri-close-large-line mobile-only"></i>
        </div>
  `;
}
