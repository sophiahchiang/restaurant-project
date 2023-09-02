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

    console.log('submitting', { restaurantName, restaurantCity });

    // Need to get values from server.js function calls and use them here. Do so using express.
    async function sendPostRequest() {
      try {
        const response = await fetch("http://localhost:3003/add-restaurant", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ restaurantName, restaurantCity }),
        });

        if (response.ok) {
          console.log("Restaurant details added to Notion successfully");
        } else {
          console.error("Failed to add restaurant details to Notion");
        }
      } catch (error) {
        console.error(error);
      }
    }
    sendPostRequest();
    // Clear the form
    addRestaurantForm.reset();
  });
});
