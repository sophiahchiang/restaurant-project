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

      // Check if the clicked tab is the "Map" tab and initialize the map
      if (btn.id === "map-tab") {
        initMap();
      }
    });
  });

  // Handle form submission
  const addRestaurantForm = document.getElementById("add-restaurant-form");
  addRestaurantForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get values from the form
    const restaurantName = document.getElementById("restaurant-name").value;
    const restaurantCity = document.getElementById("restaurant-city").value;

    console.log("submitting", { restaurantName, restaurantCity });

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
    // window.addEventListener("load", getCurrentLocation);

    sendPostRequest();
    // Clear the form
    addRestaurantForm.reset();
  });
});

// Initialize Google Map
// In client.js
function initMap() {
  const bounds = new google.maps.LatLngBounds();
  const markersArray = [];
  const map = new google.maps.Map(document.getElementById("map-content"), {
    center: { lat: 55.53, lng: 9.4 },
    zoom: 10,
  });
  // initialize services
  const geocoder = new google.maps.Geocoder();

  // Fetch restaurant data from your server
  fetch("http://localhost:3003/get-restaurants")
    .then((response) => response.json())
    .then((restaurants) => {
      restaurants.forEach((restaurant) => {
        // Use restaurant.address for geocoding
        geocoder.geocode({ address: restaurant.address }, (results, status) => {
          if (status === "OK" && results[0].geometry) {
            const location = results[0].geometry.location;
            const marker = new google.maps.Marker({
              map,
              position: location,
              title: restaurant.name,
            });

            // Create an info window for the marker
            const infoWindow = new google.maps.InfoWindow({
              content: `<div>${restaurant.name}</div>`,
            });

            // Show the info window for this marker
            infoWindow.open(map, marker);

            // Create an info window for the marker
            const addressWindow = new google.maps.InfoWindow({
              content: `<div>${restaurant.address}</div>`,
            });

            // Show the info window when the marker is clicked
            marker.addListener("click", () => {
              addressWindow.open(map, marker);
            });

            markersArray.push(marker);
            bounds.extend(location);
            map.fitBounds(bounds);
          } else {
            console.error(`Geocode was not successful for ${restaurant.name}`);
          }
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching restaurant data:", error);
    });
}

function deleteMarkers(markersArray) {
  for (let i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(null);
  }

  markersArray = [];
}

window.initMap = initMap;
