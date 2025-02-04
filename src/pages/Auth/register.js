import { handleSideBar } from "../../components/HandleSideBar.js";
import { handleLogout } from "../../components/Logout.js";
import { inserSideBar, insertNavbar } from "../../components/Navbar.js";

const registerForm = document.getElementById("registerForm");

insertNavbar("navbar", "/logo.png");
handleLogout(document.querySelector("#navbar"));
inserSideBar("side-bar");
handleSideBar("navbar", "side-close-btn");

registerForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const formData = new FormData(registerForm);

  try {
    const response = await fetch("/api/components/routes/users/register.php", {
      method: "POST",
      body: formData,
    });

    const res = await response.json();

    if (res.success) {
      window.location.href = "/src/pages/Auth/login.html";
    } else {
      alert(res.message);
      return;
    }
  } catch {
    (e) => console.log(e);
  }
});
