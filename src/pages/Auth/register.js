const registerForm = document.getElementById("registerForm");

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
      window.location.href = "./login";
    } else {
      alert(res.message);
      return;
    }
  } catch {
    (e) => console.log(e);
  }
});
