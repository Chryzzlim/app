// app.js
// CRUD FUNCTIONS FOR ORDER
// Function to create a new order
function createOrder() {
  const customerName = document.getElementById("customerName").value;
  const checkedCheckboxes = document.querySelectorAll(".product-checkbox:checked");
  const productIds = Array.from(checkedCheckboxes).map((checkbox) => parseInt(checkbox.value));
  const deliveryOptions = document.getElementById("deliveryOptions").value;
  const isPaid = document.getElementById("isPaid").value;

  console.log("Customer Name:", customerName);
  console.log("ProductIds:", productIds);
  console.log("deliveryOptions:", deliveryOptions);
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
      deliveryOptions: deliveryOptions,
      isPaid: isPaid,
    }),
  })
    .then((response) => response.text())
    .then((message) => {
      alert(message);
      // Refresh the order
      document.getElementById("createOrderForm").reset();
      getProducts();
      getOrders();
      getProductList();
      $("#createOrderModal").modal("hide");
    })
    .catch((error) => console.error("Error creating order:", error));
}

function getOrders() {
  fetch("https://app-sme2.onrender.com/orders")
    .then((response) => response.json())
    .then((orders) => {
      const orderList = document.getElementById("orderList");
      orderList.innerHTML = "";

      orders.forEach((order) => {
        const row = document.createElement("tr");
        row.style.setProperty("--bs-table-hover-color", "#efc3ca");
        row.style.setProperty("--bs-table-hover-bg", "#efc3ca");
        row.innerHTML = `
                    <td>${order.id}</td>
                    <td>${order.customerName}</td>
                    <td>₱${order.totalPrice}</td>
                    <td>${order.deliveryOptions}</td>
                    <td>${order.isPaid ? "Yes" : "No"}</td>
                    <td>
                        <ul>
                            ${order.products.map((product) => `<li>${product.name} - ₱${product.price}</li>`).join("")}
                        </ul>
                    </td>
                    <td>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteOrderById(${order.id})">Delete</button>
                        <button class="btn btn-outline-warning btn-sm" onclick="fillOrderForm(${order.id})">Edit</button>
                    </td>
                `;
        orderList.appendChild(row);
      });
    })
    .catch((error) => console.error("Error fetching orders:", error));
}

function fillOrderForm(orderId) {
  fetch(`https://app-sme2.onrender.com/orders/${orderId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((order) => {
      console.log("order:", order);
      // Populate the form fields with the retrieved data
      document.getElementById("orderId").value = orderId;
      document.getElementById("formCustomerName").value = order.customerName;
      document.getElementById("totalPrice").value = order.totalPrice;

      // Populate products list
      const productsList = document.getElementById("orderProductsList");
      productsList.innerHTML = "";

      order.products.forEach((product) => {
        // Create card structure for each product
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

        // Append the card to the products list
        productsList.appendChild(cardCol);
      });

      // Show the modal
      $("#eOrderModal").modal("show");
    })
    .catch((error) => {
      console.error("Error:", error);
      // Handle errors, update UI, or show an error message
    });
}

function saveOrderChanges() {
  // Get the values from the form
  var orderId = document.getElementById("orderId").value;
  var updatedProductName = document.getElementById("formCustomerName").value;
  var updatedPrice = document.getElementById("totalPrice").value;
  var updatedDelivery=document.getElementById("formDeliveryOptions").value;
  var updatedIsPaid = document.getElementById("formIsPaid").value;

    console.log("deliveryOptions:", updatedDelivery);
    console.log("Paid:", updatedIsPaid);

  // Prepare the data for the updateOrder function
  var updatedOrderData = {
    customerName: updatedProductName,
    totalPrice: updatedPrice,
    deliveryOptions: updatedDelivery,
    isPaid: updatedIsPaid
  };

  console.log("Order Data:", updatedOrderData);

  // Call the updateOrder function
  updateOrder(orderId, updatedOrderData);

  // Optionally, you can close the modal or perform other actions after saving changes
  $("#eOrderModal").modal("hide");
}
function updateOrder(orderId, updatedOrder) {
  // Define the endpoint URL
  const apiUrl = `https://app-sme2.onrender.com/orders/updateOrder/${orderId}`;

  // Make a PUT request
  fetch(apiUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedOrder),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Handle the successful response
      console.log("Order updated successfully:", data);
      getOrders();
      getProducts();
      getProductList();
    })
    .catch((error) => {
      // Handle errors
      console.error("Error updating product:", error);
    });
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
      getProducts();
      getOrders();
      getProductList();
    })
    .catch((error) => console.error("Error:", error));
}

// CRUD FUNCTIONS FOR PRODUCTS

function openCreateProductModal() {
  // Clear the form when opening the modal
  document.getElementById("createProductForm").reset();
  // Open the modal
  $("#createProductModal").modal("show");
}
function openCreateOrderModal() {
  // Clear the form when opening the modal
  document.getElementById("createOrderForm").reset();
  // Open the modal
  $("#createOrderModal").modal("show");
}

function createProduct() {
  // Define the endpoint URL
  const apiUrl = "https://app-sme2.onrender.com/products/saveProduct";

  const prodName = document.getElementById("newProductName").value;
  const prodPrice = document.getElementById("newProductPrice").value;

  console.log("name", prodName);
  console.log("price", prodPrice);

  // Make a POST request
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: prodName,
      price: prodPrice,
    }),
  })
    .then((response) => response.text())
    .then((message) => {
      alert(message);
      // Refresh the order
      //            document.getElementById("createOrderForm").reset();\
      getOrders();
      console.log("orders", getOrders);
      getProductList();
      getProducts();
      $("#createProductModal").modal("hide");
    })
    .catch((error) => console.error("Error creating order:", error));
}

function getProductList() {
  fetch("https://app-sme2.onrender.com/products")
    .then((response) => response.json())
    .then((products) => {
      const productList = document.getElementById("productList");
      productList.innerHTML = "";

      products.forEach((product) => {
        const row = document.createElement("tr");
        console.log("order", product.order);
        row.style.setProperty("--bs-table-hover-color", "#efc3ca");
        row.style.setProperty("--bs-table-hover-bg", "#efc3ca");
        const orderInfo = product.order ? product.order.customerName : "N/A";
        row.innerHTML = `
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>₱${product.price}</td>
                    <td>${orderInfo}</td>
                    <td>${product.status}</td>
                    <td>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteProductById(${product.id})">Delete</button>
                        <button class="btn btn-outline-warning btn-sm" onclick="fillForm(${product.id})" data-bs-toggle="modal" data-bs-target="#eProductModal">Edit</button>
                    </td>
                `;
        productList.appendChild(row);
      });
    })
    .catch((error) => console.error("Error fetching products:", error));
}

function fillForm(productId) {
  fetch(`https://app-sme2.onrender.com/products/${productId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((product) => {
      // Populate the form fields with the retrieved data
      document.getElementById("productId").value = productId;
      document.getElementById("productName").value = product.name;
      document.getElementById("price").value = product.price;

      // Show the modal
      $("#eProductModal").modal("show");
    })
    .catch((error) => {
      console.error("Error:", error);
      // Handle errors, update UI, or show an error message
    });
}
function saveChanges() {
  // Get the values from the form
  var productId = document.getElementById("productId").value;
  var updatedProductName = document.getElementById("productName").value;
  var updatedPrice = document.getElementById("price").value;

  // Prepare the data for the updateProduct function
  var updatedProductData = {
    name: updatedProductName,
    price: updatedPrice,
  };

  // Call the updateProduct function
  updateProduct(productId, updatedProductData);

  // Optionally, you can close the modal or perform other actions after saving changes
  $("#eProductModal").modal("hide");
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

function updateProduct(productId, updatedProduct) {
  // Define the endpoint URL
  const apiUrl = `https://app-sme2.onrender.com/products/updateProduct/${productId}`;

  // Make a PUT request
  fetch(apiUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedProduct),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Handle the successful response
      console.log("Product updated successfully:", data);
      getOrders();
      getProductList();
      getProducts();
    })
    .catch((error) => {
      // Handle errors
      console.error("Error updating product:", error);
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
      getProducts();
      getOrders();
      getProductList();
    })
    .catch((error) => console.error("Error:", error));
}

// Initial load of orders and products

getProducts();
getOrders();
getProductList();

// Function to show/hide sections based on route
function navigateTo(route) {
  const sections = ["orderListSection", "productListSection"];
  sections.forEach((section) => {
    document.getElementById(section).style.display = section === route ? "block" : "none";
  });
}

// Function to initialize the app
function initApp() {
  navigateTo("orderListSection"); // Set the initial route
}

// Call initApp to initialize the app when the page loads
window.onload = initApp;
