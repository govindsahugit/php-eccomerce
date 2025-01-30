import axios from "axios";
import { insertNavbar } from "../../../components/Navbar.js";
import { handleLogout } from "../../../components/Logout.js";

insertNavbar("navbar", "/logo.png");
handleLogout(document.querySelector("#navbar"))

const currentUser = JSON.parse(localStorage.getItem("user"));
const usersContainer = document.querySelector("#users-container");
const tbody = document.getElementsByTagName("tbody");

const fetchUsers = async () => {
  if (currentUser.role !== 2) {
    usersContainer.innerHTML = `<h1>You are not authorized to view this page</h1>`;
    return;
  }
  try {
    const { data } = await axios.get("/api/components/routes/users/users.php", {
      aid: currentUser.id,
    });
    if (data.success) {
      tbody[0].innerHTML = "";
      data.data.forEach((user, i) => {
        const userRow = document.createElement("tr");
        userRow.classList.add("user");
        userRow.innerHTML = `
            <td>${i + 1}.</td>
            <td>${user.name}</td>
            <td>${user.phone}</td>
            <td class="actions">
            ${
              user.role === 2
                ? `<span id="main-admin">Main admin</span>`
                : user.role === 0
                ? `<button class="update" dataid="${user.id}">Make Admin</button>`
                : `<span id="admin">Admin</span>`
            }
            ${
              user.role !== 2
                ? `<button class="delete" dataid="${user.id}">Delete</button>`
                : ""
            }
            </td>
        `;
        tbody[0].appendChild(userRow);
      });
    } else {
      console.log(data.message);
    }
  } catch {
    (e) => console.log(e);
  }
};
fetchUsers();

// make admin
tbody[0].addEventListener("click", async (e) => {
  if (e.target.classList.contains("update")) {
    const id = e.target.getAttribute("dataid");
    const requestData = {
      aid: currentUser.id,
      role: 1,
    };
    try {
      const { data } = await axios.post(
        `/api/components/routes/users/update.php?userid=${id}`,
        requestData
      );
      if (data.success) {
        fetchUsers();
      } else {
        console.log(data.message);
      }
    } catch {
      (e) => console.log(e);
    }
  }
});

// Delete user
tbody[0].addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete")) {
    const id = e.target.getAttribute("dataid");
    try {
      const { data } = await axios.delete(
        `/api/components/routes/users/delete.php?id=${id}&aid=${currentUser.id}`
      );
      if (data.success) {
        fetchUsers();
      } else {
        console.log(data.message);
      }
    } catch {
      (e) => console.log(e);
    }
  }
});
