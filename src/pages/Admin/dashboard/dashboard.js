import { handleSideBar } from "../../../components/HandleSideBar";
import { handleLogout } from "../../../components/Logout";
import { inserSideBar, insertNavbar } from "../../../components/Navbar";

insertNavbar("navbar", "/logo.png");
handleLogout(document.querySelector("#navbar"));
inserSideBar("side-bar");
handleSideBar("navbar", "side-close-btn");

if (!JSON.parse(localStorage.getItem("user"))) {
  document.querySelector(".main-content").innerHTML =
    "<h1>You are not authorized to view this page</h1>";
  alert("You are not authorized to view this page");
  window.location.href = "/";
}

const nameSpan = document.querySelector(".main-content #name");

const userData = JSON.parse(localStorage.getItem("user"));

nameSpan.innerHTML = userData.name;
