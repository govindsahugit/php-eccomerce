import axios from "axios";
import { inserSideBar, insertNavbar } from "../../../components/Navbar.js";
import { handleLogout } from "../../../components/Logout.js";
import { useLocalStorage } from "../../../hooks/useLocalStorage.js";
import { handleSideBar } from "../../../components/HandleSideBar.js";

insertNavbar("navbar", "/logo.png");
handleLogout(document.querySelector("#navbar"));
inserSideBar("side-bar");
handleSideBar("navbar", "side-close-btn");

const aid = JSON.parse(localStorage.getItem("user"))?.id;
const ordersContainer = document.querySelector("#orders-container");

const [orderData, setOrderData] = useLocalStorage("orderData", []);

if (JSON.parse(localStorage.getItem("user"))?.role !== 2) {
  ordersContainer.innerHTML = `<h1>You are not authorized to view this page</h1>`;
}

const getOrders = async () => {
  try {
    const { data } = await axios.get(
      `/api/components/routes/orders/orders.php?aid=${aid}`
    );
    if (data.success) {
      ordersContainer.innerHTML = "";
      setOrderData(data.data);
      data.data.forEach((order) => {
        const orderCard = document.createElement("div");
        orderCard.classList.add("order-card");
        orderCard.innerHTML = `
        <h2>Customer details</h2> <br>
          <div class="order-card-body">
            <p>Customer name: ${order.buyer}</p>
            <p>Customer Phone: ${order.phone}</p>
            <p>Customer address: ${order.address}</p>
            </div> <br> 
            <h2>Ordered items</h2> <br>
            <div class="order-card-footer">
            ${order.products
              .map(
                (item) => `
                <div class="order-item">
                <p>Item name: ${
                  item.half_price ? "Half" : item.full_price && "Full"
                } ${item.name}</p>
                <p>Item price: Rs.${
                  item.half_price
                    ? item.half_price.substring(
                        item.half_price.length - 3,
                        item.half_price.length
                      )
                    : item.full_price.substring(
                        item.full_price.length - 3,
                        item.full_price.length
                      )
                }</p>
                </div>
                `
              )
              .join("")}
              </div> <br>
              <div class="bottom-content"
              <h3>Total: Rs.${order.total}</h3>
              <button data-id=${order.id}>Done</button>
              </div>
        `;
        ordersContainer.appendChild(orderCard);
      });
    } else {
      ordersContainer.innerHTML = `
      <div class="no-orders">
      <h2>No orders yet</h2>
      </div>
      `;
    }
  } catch {
    (e) => console.log(e);
  }
};

getOrders();

// send orderhistory
ordersContainer.addEventListener("click", async (e) => {
  if (e.target.tagName === "BUTTON") {
    const history = orderData;
    const requestData = { aid, history };
    const dataId = e.target.getAttribute("data-id");
    try {
      const { data } = await axios.post(
        "/api/components/routes/order-histories/create.php",
        requestData
      );
      if (data.success) {
        const deleteResponse = await axios.delete(
          `/api/components/routes/orders/delete.php?orderid=${dataId}&aid=${aid}`
        );
        if (deleteResponse.data.success) {
          // window.location.reload();
          getOrders();
        } else {
          console.log("Something went wrong while deleting the order.");
        }
      }
    } catch {
      (e) => console.log(e);
    }
  }
});
