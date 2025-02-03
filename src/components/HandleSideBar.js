import gsap from "gsap";

export function handleSideBar(targetId, closeId) {
  const targetElement = document.getElementById(targetId);
  const closeBtn = document.getElementById(closeId);
  targetElement?.addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-toggle")) {
      gsap.to("#side-bar", {
        transform: "translateX(0%)",
      });
    }
  });
  closeBtn?.addEventListener("click", (e) => {
    if (e.target.classList.contains("ri-close-large-line")) {
      gsap.to("#side-bar", {
        transform: "translateX(100%)",
      });
    }
  });
}
