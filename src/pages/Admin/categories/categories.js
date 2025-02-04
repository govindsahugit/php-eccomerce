import axios from "axios";
import { inserSideBar, insertNavbar } from "../../../components/Navbar.js";
import { handleLogout } from "../../../components/Logout.js";
import { handleSideBar } from "../../../components/HandleSideBar.js";

document.addEventListener("DOMContentLoaded", () => {
  const createForm = document.getElementById("create-form");
  const updateForm = document.getElementById("update-form");
  const tableBody = document.querySelector("#categories-table tbody");
  const aid = JSON.parse(localStorage.getItem("user"))?.id;
  let categoryId = "";
  const mainContainer = document.querySelector(".container");

  insertNavbar("navbar", "/logo.png");
  handleLogout(document.querySelector("#navbar"));
  inserSideBar("side-bar");
  handleSideBar("navbar", "side-close-btn");

  if (JSON.parse(localStorage.getItem("user"))?.role !== 2) {
    mainContainer.innerHTML = `<h1>You are not authorized to view this page</h1>`;
    return;
  }

  // Fetch and display categories
  async function fetchCategories() {
    try {
      const response = await fetch(
        "/api/components/routes/categories/categories.php"
      );
      const result = await response.json();
      // console.log(data);
      tableBody.innerHTML = "";
      if (result.success) {
        result.data.forEach((category, i) => {
          const row = document.createElement("tr");
          row.innerHTML = `
                          <td>${i + 1}.</td>
                          <td>${category.name}</td>
                          <td class="actions">
                              <button class="update" dataid="${
                                category.id
                              }">Update</button>
                              <button class="delete" dataid="${
                                category.id
                              }">Delete</button>
                          </td>
                      `;
          tableBody.appendChild(row);
        });
      } else {
        alert(result.message);
      }
    } catch {
      (e) => console.log(e);
    }
  }

  // Handle form submission to create category
  createForm.addEventListener("submit", async (e) => {
    try {
      e.preventDefault();
      const requestData = { aid, name: createForm[0].value };
      const { data } = await axios.post(
        `/api/components/routes/categories/create.php`,
        requestData
      );
      if (data.success) {
        createForm.reset();
        fetchCategories();
      } else {
        alert(data.message);
      }
    } catch {
      (e) => console.log(e);
    }
  });

  // handle delete category
  const handleDelete = async (id) => {
    try {
      const requestData = { aid };
      const { data } = await axios.delete(
        `/api/components/routes/categories/delete.php?id=${id}`,
        {
          params: requestData,
        }
      );
      if (data.success) {
        fetchCategories();
      } else {
        alert(data.message);
      }
    } catch {
      (e) => console.log(e);
    }
  };

  tableBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
      const deleteId = e.target.getAttribute("dataid");
      handleDelete(deleteId);
    } else if (e.target.classList.contains("update")) {
      const updateCategoryName =
        e.target.parentNode.parentNode.childNodes[3].textContent;
      createForm.style.display = "none";
      updateForm.style.display = "flex";
      updateForm[0].value = updateCategoryName;
      const updateId = e.target.getAttribute("dataid");
      categoryId = updateId;
    }
  });

  // update category
  updateForm.addEventListener("submit", async (e) => {
    try {
      e.preventDefault();
      const requestData = { aid, name: updateForm[0].value };
      const { data } = await axios.post(
        `/api/components/routes/categories/update.php?id=${categoryId}`,
        requestData
      );
      if (data.success) {
        updateForm.reset();
        updateForm.style.display = "none";
        createForm.style.display = "flex";
        categoryId = "";
        fetchCategories();
      } else {
        alert(data.message);
      }
    } catch {
      (e) => console.log(e);
    }
  });

  // Initial fetch of categories
  fetchCategories();
});
