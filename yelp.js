const axios = require("axios");

// Replace 'YOUR_API_KEY' with your actual Yelp Fusion API key
const api_key =
  "PpvUN9UiZ9_dvYu43ypQFT5bOjfOFttwyuNkQvSOnti14li3MdCbFpBPFvhqQu5EMSCoU3rnLqhCTTUJ9k-Sq4Q8l5TmAcVOX5H7VsBGnbW9L5Xwx-S4QX9OhS7yZHYx";

// Define the Yelp Fusion API endpoint for business search
const endpoint = "https://api.yelp.com/v3/businesses/search";

async function getRestaurantDetails(restaurantName, location) {
  // You've got to enter it in with name and location
  const params = {
    term: restaurantName, // Replace with the restaurant name you want to search
    location: location, // Replace with a specific location if needed
    limit: 1, // Limit to 1 result, assuming the restaurant name is unique
  };

  // Define the headers with your API key
  const headers = {
    Authorization: `Bearer ${api_key}`,
  };

  try {
    // Send the API request
    const response = await axios.get(endpoint, { params, headers });

    // Check if the request was successful (status code 200)
    if (response.status === 200) {
      const data = response.data;
      if (data.businesses && data.businesses.length > 0) {
        const business = data.businesses[0]; // Assuming we found a match
        const rating = business.rating;
        const priceRange = business.price || "N/A";
        const cuisineType = business.categories?.[0]?.title || "N/A";
        const isClosed = business.is_closed;
        const location = business.coordinates;
        const restaurantDetails = {
          Rating: rating,
          "Price Range": priceRange,
          "Cuisine Type": cuisineType,
          Open: !isClosed,
          Location: location,
        };
        return restaurantDetails;
      } else {
        console.log("Restaurant not found on Yelp");
      }
    } else {
      console.log("Yelp API request failed");
    }
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  }
}

getRestaurantDetails("Driftwood Deli and Market", "Palo Alto")
  .then((restaurantDetails) => {
    console.log("Restaurant Details:");
    for (const key in restaurantDetails) {
      console.log(`${key}: ${restaurantDetails[key]}`);
    }
  })
  .catch((error) => {
    console.error(error);
  });

//module.exports = getRestaurantDetails;
