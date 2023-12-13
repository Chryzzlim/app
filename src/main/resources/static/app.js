// app.js

// Function to create a new order
function createOrder() {
  const customerName = document.getElementById("customerName").value;
  const checkedCheckboxes = document.querySelectorAll(".product-checkbox:checked");
  const productIds = Array.from(checkedCheckboxes).map((checkbox) => parseInt(checkbox.value));
  const isMeetup = document.getElementById("isMeetup").checked;
  const isPaid = document.getElementById("isPaid").checked;

  console.log("Customer Name:", customerName);
  console.log("ProductIds:", productIds);
  console.log("Meetup:", isMeetup);
  console.log("Paid:", isPaid);

  // Construct the query parameter string for productIds
  const productIdsQueryParam = productIds.map((id) => `productIds=${id}`).join("&");

  fetch(`https://app-sme2.onrender.com/orders/createOrder?${productIdsQueryParam}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customerName: customerName,
      isMeetup: isMeetup,
      isPaid: isPaid,
    }),
  })
    .then((response) => response.text())
    .then((message) => {
      alert(message);
      // Refresh the order
      document.getElementById("createOrderForm").reset();
      getOrders();
    })
    .catch((error) => console.error("Error creating order:", error));
}

function deleteOrderById(orderId) {
  fetch(`https://app-sme2.onrender.com/orders/${orderId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.text();
      } else if (response.status === 404) {
        throw new Error("Order not found");
      } else {
        throw new Error("Error deleting order");
      }
    })
    .then((message) => {
      console.log(message); // Log success message
      alert(message);
      // Refresh the order list
      getOrders();
    })
    .catch((error) => console.error("Error:", error));
}

function getOrders() {
  fetch("https://app-sme2.onrender.com/orders")
    .then((response) => response.json())
    .then((orders) => {
      const orderList = document.getElementById("orderList");
      orderList.innerHTML = "";

      orders.forEach((order) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${order.id}</td>
                    <td>${order.customerName}</td>
                    <td>${order.totalPrice}</td>
                    <td>${order.isMeetup ? "Yes" : "No"}</td>
                    <td>${order.isPaid ? "Yes" : "No"}</td>
                    <td>
                        <ul>
                            ${order.products.map((product) => `<li>${product.name} - ${product.price}</li>`).join("")}
                        </ul>
                    </td>
                    <td>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteOrderById(${order.id})">Delete</button>
                        <button class="btn btn-outline-warning btn-sm" onclick="updateProduct(${product.id})">Edit</button>
                    </td>
                `;
        orderList.appendChild(row);
      });
    })
    .catch((error) => console.error("Error fetching orders:", error));
}

function getProductList() {
  fetch("https://app-sme2.onrender.com/products")
    .then((response) => response.json())
    .then((products) => {
      const productList = document.getElementById("productList");
      productList.innerHTML = "";

      products.forEach((product) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.price}</td>
                    <td>${product.order.customerName}</td>
                    <td>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteProductById(${product.id})">Delete</button>
                        <button class="btn btn-outline-warning btn-sm" onclick="updateProduct(${product.id})">Edit</button>
                    </td>
                `;
        productList.appendChild(row);
      });
    })
    .catch((error) => console.error("Error fetching products:", error));
}
function updateProduct(productId, updatedProduct) {
  // Define the endpoint URL
  const apiUrl = `https://app-sme2.onrender.com//products/updateProduct/${productId}`;

  // Make a PUT request
  fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedProduct),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Handle the successful response
      console.log('Product updated successfully:', data);
    })
    .catch(error => {
      // Handle errors
      console.error('Error updating product:', error);
    });
}

function deleteProductById(productId) {
  fetch(`https://app-sme2.onrender.com/products/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.text();
      } else if (response.status === 404) {
        throw new Error("Product not found");
      } else {
        throw new Error("Error deleting order");
      }
    })
    .then((message) => {
      console.log(message); // Log success message
      alert(message);
      // Refresh the order list
      getProductList();
    })
    .catch((error) => console.error("Error:", error));
}

function getProducts() {
  fetch("https://app-sme2.onrender.com/products")
    .then((response) => response.json())
    .then((products) => {
      const productCheckboxList = document.getElementById("productCheckboxList");
      productCheckboxList.innerHTML = "";

      products.forEach((product) => {
        const cardCol = document.createElement("div");
        cardCol.classList.add("col-md-4", "mb-3"); // Bootstrap grid column class

        const card = document.createElement("div");
        card.classList.add("card");
        card.style.backgroundColor = "#EFC3CA";
        card.style.border = "2px solid #957DAD";
        card.style.cursor = "pointer";

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.style.borderColor = "#957DAD";
        checkbox.style.cursor = "pointer";
        checkbox.className = "product-checkbox";
        checkbox.value = product.id;
        checkbox.dataset.productName = product.name;
        checkbox.classList.add("form-check-input", "mr-2"); // Add form-check-input class and margin to the checkbox


        checkbox.addEventListener("click", () => {
          checkbox.click(); // Trigger the checkbox click when the checkbox is clicked
        });

        const label = document.createElement("label");
        label.textContent = `${product.name} - ₱${product.price}`;
        label.style.textTransform = "capitalize";
        label.style.marginLeft = "10px";
        label.style.color = "#957DAD";
        label.classList.add("form-check-label");

        card.addEventListener("click", () => {
          checkbox.click(); // Trigger the checkbox click when the card is clicked
        });

        cardBody.appendChild(checkbox);
        cardBody.appendChild(label);
        card.appendChild(cardBody);
        cardCol.appendChild(card);

        productCheckboxList.appendChild(cardCol);
      });
    })
    .catch((error) => console.error("Error fetching products:", error));
}

// Initial load of orders and products

getProducts();
getOrders();
getProductList();

// Function to show/hide sections based on route
function navigateTo(route) {
  const sections = ["createOrderSection", "orderListSection", "productListSection"];
  sections.forEach((section) => {
    document.getElementById(section).style.display = section === route ? "block" : "none";
  });
}

// Function to initialize the app
function initApp() {
  navigateTo("createOrderSection"); // Set the initial route
}

// Call initApp to initialize the app when the page loads
window.onload = initApp;
