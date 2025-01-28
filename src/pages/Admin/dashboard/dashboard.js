import { insertNavbar } from "../../../components/Navbar";

insertNavbar("navbar", "/logo.png");

const nameSpan = document.querySelector(".main-content #name");

const userData = JSON.parse(localStorage.getItem("user"));

nameSpan.innerHTML = userData.name;
