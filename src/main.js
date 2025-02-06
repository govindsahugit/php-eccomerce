import { inserSideBar, insertNavbar } from "./components/Navbar.js";
import { handleLogout } from "./components/Logout.js";
import "remixicon/fonts/remixicon.css";
import { handleSideBar } from "./components/HandleSideBar.js";
import Navigo from "navigo";
import {
  dashboardJS,
  dashboardPage,
} from "./pages/Admin/dashboard/dashboard.js";
import { Home, HomeJs } from "./pages/Home/HomePaje.js";
import {
  categoryJs,
  categoryPage,
} from "./pages/Admin/categories/categories.js";
import {
  ProductPage,
  ProductsPageJs,
} from "./pages/Admin/products/products.js";
import { orderPage, OrderPageJs } from "./pages/Admin/orders/orders.js";
import {
  HistoriesPage,
  HistoriesPageJs,
} from "./pages/Admin/histories/histories.js";
import { UserPage, UserPageJs } from "./pages/Admin/users/users.js";
import { LoginPage, LoginPageJs } from "./pages/Auth/login.js";
import { RegisterPage, RegisterPageJs } from "./pages/Auth/register.js";

insertNavbar("navbar", "/logo.png");
inserSideBar("side-bar");
handleSideBar("navbar", "side-close-btn");

const navBar = document.querySelector("#navbar");
handleLogout(navBar);

const cartCountEle = document.querySelector(".cart-count");

if (cartCountEle) {
  cartCountEle.textContent = JSON.parse(localStorage.getItem("cart"))?.length;
}

// Request fullscreen on a user gesture (e.g., button click)
function enterFullscreen() {
  const element = document.documentElement; // Target the entire page
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    // Firefox
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    // Chrome/Safari
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    // IE/Edge
    element.msRequestFullscreen();
  }
}

window.addEventListener("touchstart", enterFullscreen);

// --------------------------------------------------  //
// Routing operations

window.addEventListener("DOMContentLoaded", (e) => {
  const router = new Navigo("/", { linksSelector: "[data-navigo]" });
  const app = document.getElementById("app");

  router
    .on("/", () => {
      app.innerHTML = "";
      app.innerHTML = Home();
      HomeJs();
    })
    .on("/dashboard", () => {
      app.innerHTML = "";
      app.innerHTML = dashboardPage();
      dashboardJS();
    })
    .on("/dashboard/categories", () => {
      app.innerHTML = "";
      app.innerHTML = categoryPage();
      categoryJs();
    })
    .on("/dashboard/products", () => {
      app.innerHTML = "";
      app.innerHTML = ProductPage();
      ProductsPageJs();
    })
    .on("/dashboard/orders", () => {
      app.innerHTML = "";
      app.innerHTML = orderPage();
      OrderPageJs();
    })
    .on("/dashboard/histories", () => {
      app.innerHTML = "";
      app.innerHTML = HistoriesPage();
      HistoriesPageJs();
    })
    .on("/dashboard/users", () => {
      app.innerHTML = "";
      app.innerHTML = UserPage();
      UserPageJs();
    })
    .on("/login", () => {
      app.innerHTML = "";
      app.innerHTML = LoginPage();
      LoginPageJs();
    })
    .on("/register", () => {
      app.innerHTML = "";
      app.innerHTML = RegisterPage();
      RegisterPageJs();
    });

  router.resolve();
});
