export function handleLogout(logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    if (e.target.classList.contains("logout-btn")) {
      localStorage.removeItem("user");
      window.location.reload();
      window.location.href = "/login";
    }
  });
}
