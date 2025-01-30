import { handleLogout } from "../../../components/Logout";
import { insertNavbar } from "../../../components/Navbar";

insertNavbar("navbar", "/logo.png");
handleLogout(document.querySelector("#navbar"));

const nameSpan = document.querySelector(".main-content #name");

const userData = JSON.parse(localStorage.getItem("user"));

nameSpan.innerHTML = userData.name;
