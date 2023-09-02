import { createNotionEntry } from "./notion.js";

document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  // Show the "List" tab content and set it as active by default
  const listTabButton = document.getElementById("list-tab");
  const listTabContent = document.getElementById("list-content");

  listTabButton.classList.add("active");
  listTabContent.style.display = "block";

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Hide all tab contents
      tabContents.forEach((content) => {
        content.style.display = "none";
      });

      // Remove "active" class from all tab buttons
      tabButtons.forEach((btn) => {
        btn.classList.remove("active");
      });

      // Show the selected tab content
      const tabId = btn.id.replace("-tab", "-content");
      document.getElementById(tabId).style.display = "block";

      // Add "active" class to the clicked tab button
      btn.classList.add("active");
    });
  });

  // Handle form submission
  const addRestaurantForm = document.getElementById("add-restaurant-form");
  addRestaurantForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get values from the form
    const restaurantName = document.getElementById("restaurant-name").value;
    const restaurantCity = document.getElementById("restaurant-city").value;

    // Send the values to the Flask route using AJAX
    fetch("http://127.0.0.1:5000/get-restaurant-details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        restaurantName: restaurantName,
        restaurantCity: restaurantCity,
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        // Do something with the received data (restaurant_details)
        console.log("Restaurant Details:", data);
        console.log(data["Name"]);
        console.log(data["Cuisine Type"]);
        console.log(data["Rating"]);
        console.log(data["Price Range"]);
        console.log(data["Open"]);
        console.log(data["Location"]);
        await createNotionEntry(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // Clear the form
    addRestaurantForm.reset();
  });
});
