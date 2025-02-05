export function LoginPageJs() {
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
}

export function LoginPage() {
  return `
  <main id="user-auth">
      <div class="auth-container">
        <h1>User Login</h1>
        <form id="login-form">
          <label for="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="Enter your phone number"
            required />
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            required />
          <button type="submit">Login</button>
        </form>
        <a id="bottom-link" href="/src/pages/Auth/register.html"
          >Don't have an account? <span>Register account.</span>
        </a>
      </div>
    </main>
  `;
}
