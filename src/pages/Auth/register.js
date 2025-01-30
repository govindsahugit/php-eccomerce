import { handleLogout } from "../../components/Logout";
import { insertNavbar } from "../../components/Navbar";

const registerForm = document.getElementById("registerForm");

insertNavbar("navbar", "/logo.png");
handleLogout(document.querySelector("#navbar"));

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
