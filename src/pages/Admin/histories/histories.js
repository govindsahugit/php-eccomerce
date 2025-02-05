import axios from "axios";

export function HistoriesPageJs() {
  const aid = JSON.parse(localStorage.getItem("user"))?.id;
  const historiesContainer = document.querySelector("#histories-container");

  if (JSON.parse(localStorage.getItem("user"))?.role < 2) {
    historiesContainer.innerHTML = `<h1>You are not authorized to view this page</h1>`;
  } else {
    const getHistories = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URI
          }/components/routes/order-histories/histories.php?aid=${aid}`
        );
        const histories = response.data.data;
        historiesContainer.innerHTML = "";
        histories.forEach((history) => {
          const orderCard = document.createElement("div");
          orderCard.classList.add("order-card");
          orderCard.innerHTML = `
              <h2>Customer details</h2> <br>
                <div class="order-card-body">
                  <p>Customer name: ${JSON.parse(history.history)[0].buyer}</p>
                  <p>Customer Phone: ${JSON.parse(history.history)[0].phone}</p>
                  <p>Customer address: ${
                    JSON.parse(history.history)[0].address
                  }</p>
                  </div> <br> 
                  <h2>Ordered items</h2> <br>
                  <div class="order-card-footer">
                  ${JSON.parse(history.history)[0]
                    .products.map(
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
                    <div class="bottom-content-h"
                    <h3>Total: Rs.${JSON.parse(history.history)[0].total}</h3>
                    <button data-id=${history.id}>Delete</button>
                    </div>
              `;
          historiesContainer.appendChild(orderCard);
        });
      } catch {
        (e) => console.log(e);
      }
    };
    getHistories();

    historiesContainer.addEventListener("click", async (e) => {
      if (e.target.tagName === "BUTTON") {
        const id = e.target.dataset.id;
        try {
          const { data } = await axios.delete(
            `${
              import.meta.env.VITE_API_URI
            }/components/routes/order-histories/delete.php?historyid=${id}&aid=${aid}`
          );
          if (data.success) {
            getHistories();
          }
        } catch {
          (e) => console.log(e);
        }
      }
    });
  }
}

export function HistoriesPage() {
  return `
  <div id="histories-container"></div>
  <div id="cart-container-wrapper">
          <div id="cart-container"></div>
        </div>
        <div class="close-btn">
          <i class="ri-close-large-line mobile-only"></i>
        </div>
  `;
}
