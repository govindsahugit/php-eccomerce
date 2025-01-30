export function handleLogout(logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    if (e.target.classList.contains("logout-btn")) {
      console.log("clicked logout btn");
      localStorage.removeItem("user");
      window.location.reload();
      window.location.href = "/src/pages/Auth/login.html";
    }
  });
}
