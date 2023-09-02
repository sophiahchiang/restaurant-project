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
        // await createNotionEntry(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // Clear the form
    addRestaurantForm.reset();
  });
});

// function initMap() {
//   const bounds = new google.maps.LatLngBounds();
//   const markersArray = [];
//   const map = new google.maps.Map(document.getElementById("map"), {
//     center: { lat: 55.53, lng: 9.4 },
//     zoom: 10,
//   });
//   // initialize services
//   const geocoder = new google.maps.Geocoder();
//   const service = new google.maps.DistanceMatrixService();
//   // build request
//   const origin1 = { lat: 55.93, lng: -3.118 };
//   const origin2 = "Greenwich, England";
//   const destinationA = "Stockholm, Sweden";
//   const destinationB = { lat: 50.087, lng: 14.421 };
//   const request = {
//     origins: [origin1, origin2],
//     destinations: [destinationA, destinationB],
//     travelMode: google.maps.TravelMode.DRIVING,
//     unitSystem: google.maps.UnitSystem.METRIC,
//     avoidHighways: false,
//     avoidTolls: false,
//   };

//   // put request on page
//   document.getElementById("request").innerText = JSON.stringify(
//     request,
//     null,
//     2
//   );
//   // get distance matrix response
//   service.getDistanceMatrix(request).then((response) => {
//     // put response
//     document.getElementById("response").innerText = JSON.stringify(
//       response,
//       null,
//       2
//     );

//     // show on map
//     const originList = response.originAddresses;
//     const destinationList = response.destinationAddresses;

//     deleteMarkers(markersArray);

//     const showGeocodedAddressOnMap = (asDestination) => {
//       const handler = ({ results }) => {
//         map.fitBounds(bounds.extend(results[0].geometry.location));
//         markersArray.push(
//           new google.maps.Marker({
//             map,
//             position: results[0].geometry.location,
//             label: asDestination ? "D" : "O",
//           })
//         );
//       };
//       return handler;
//     };

//     for (let i = 0; i < originList.length; i++) {
//       const results = response.rows[i].elements;

//       geocoder
//         .geocode({ address: originList[i] })
//         .then(showGeocodedAddressOnMap(false));

//       for (let j = 0; j < results.length; j++) {
//         geocoder
//           .geocode({ address: destinationList[j] })
//           .then(showGeocodedAddressOnMap(true));
//       }
//     }
//   });
// }

// function deleteMarkers(markersArray) {
//   for (let i = 0; i < markersArray.length; i++) {
//     markersArray[i].setMap(null);
//   }

//   markersArray = [];
// }

// window.initMap = initMap;
