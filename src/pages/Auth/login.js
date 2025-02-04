import { handleLogout } from "../../components/Logout.js";
import { inserSideBar, insertNavbar } from "../../components/Navbar.js";
import { handleSideBar } from "../../components/HandleSideBar.js";

insertNavbar("navbar", "/logo.png");
handleLogout(document.querySelector("#navbar"));
inserSideBar("side-bar");
handleSideBar("navbar", "side-close-btn");

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const formData = new FormData(loginForm);

  try {
    const response = await fetch("/api/components/routes/users/login.php", {
      method: "POST",
      body: formData,
    });

    const res = await response.json();

    if (res.success) {
      window.location.href = "/";
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: res.data.id,
          name: res.data.name,
          phone: res.data.phone,
          role: res.data.role,
        })
      );
    } else {
      alert(res.message);
      return;
    }
  } catch {
    (e) => console.log(e);
  }
});
