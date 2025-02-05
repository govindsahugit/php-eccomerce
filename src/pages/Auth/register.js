export function RegisterPageJs() {
  const registerForm = document.getElementById("registerForm");

  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(registerForm);

    try {
      const response = await fetch(
        "/api/components/routes/users/register.php",
        {
          method: "POST",
          body: formData,
        }
      );

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
}

export function RegisterPage() {
  return `
  <main id="user-auth">
      <div class="auth-container">
        <h1>User Registration</h1>
        <form id="registerForm">
          <label for="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your full name"
            required />
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
          <button type="submit">Register</button>
        </form>
        <a href="/src/pages/Auth/login.html" id="bottom-link">
          Already have an account? <span>Login account.</span>
        </a>
      </div>
    </main>
  `;
}
