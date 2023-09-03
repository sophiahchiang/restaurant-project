// EXPRESS

const express = require("express");
const cors = require("cors");
const app = express();
const port = 3003;

const axios = require("axios");
const { Client } = require("@notionhq/client");
const googleMapsClient = require("@google/maps").createClient({
  key: "AIzaSyC3cN95E1Cght0KuIRP5Iq0zc4fJjwatz0", // Replace with your Google API key
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// YELP

// Replace 'YOUR_API_KEY' with your actual Yelp Fusion API key
const api_key =
  "PpvUN9UiZ9_dvYu43ypQFT5bOjfOFttwyuNkQvSOnti14li3MdCbFpBPFvhqQu5EMSCoU3rnLqhCTTUJ9k-Sq4Q8l5TmAcVOX5H7VsBGnbW9L5Xwx-S4QX9OhS7yZHYx";

// Define the Yelp Fusion API endpoint for business search
const endpoint = "https://api.yelp.com/v3/businesses/search";

async function getRestaurantDetails(restaurantName, location) {
  const params = {
    term: restaurantName,
    location: location,
    limit: 1,
  };

  const headers = {
    Authorization: `Bearer ${api_key}`,
  };

  try {
    const yelpResponse = await axios.get(endpoint, { params, headers });

    if (yelpResponse.status === 200) {
      const yelpData = yelpResponse.data;

      if (yelpData.businesses && yelpData.businesses.length > 0) {
        const business = yelpData.businesses[0];
        console.log(business);
        const name = business.name;
        const rating = business.rating;
        const priceRange = business.price || "N/A";
        const cuisineType = business.categories?.[0]?.title || "N/A";
        const isClosed = business.is_closed;
        const location = business.coordinates;
        const address = business.location.display_address;

        const origin = "872 Sycamore Dr Palo Alto CA 94303";
        const destination = `${location.latitude},${location.longitude}`;

        const distanceMatrixResponse = await new Promise((resolve, reject) => {
          googleMapsClient.distanceMatrix(
            {
              origins: [origin],
              destinations: [destination],
              mode: "driving",
              units: "imperial",
            },
            (err, response) => {
              if (!err) {
                resolve(response);
              } else {
                reject(err);
              }
            }
          );
        });

        const distance =
          distanceMatrixResponse.json.rows[0].elements[0].distance.text;
        const duration =
          distanceMatrixResponse.json.rows[0].elements[0].duration.text;

        const restaurantDetails = {
          Name: name,
          Rating: rating,
          "Price Range": priceRange,
          "Cuisine Type": cuisineType,
          Open: !isClosed,
          Location: address,
          Distance: distance,
          Duration: duration,
        };

        console.log(restaurantDetails);
        return restaurantDetails;
      } else {
        console.log("Restaurant not found on Yelp");
      }
    } else {
      console.log("Yelp API request failed");
    }
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
    throw error; // Propagate the error
  }
}

// Test yelp api example
// console.log(getRestaurantDetails("Driftwood Deli and Market", "Palo Alto"));
// console.log(getRestaurantDetails("In N Out", "Mountain View"));

// .then((restaurantDetails) => {
//   console.log("Restaurant Details:");
//   for (const key in restaurantDetails) {
//     console.log(`${key}: ${restaurantDetails[key]}`);
//   }
// })
// .catch((error) => {
//   console.error(error);
// });

// NOTION

// Create a new page in the specified database
async function createNotionEntry(restaurantDetails) {
  // const { Client } = require("@notionhq/client");

  // Replace with your Notion API integration token
  const NOTION_API_KEY = "secret_yB0bzDUDBGVC3eHjbwJtYL5yg78jN2gtX88Vmqx8uQA";

  const notion = new Client({
    auth: NOTION_API_KEY,
  });

  // Define the database ID where you want to add entries
  const DATABASE_ID = "de69ce7308d546fd96f5b59babd67b67";
  try {
    const response = await notion.pages.create({
      parent: {
        database_id: DATABASE_ID,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: restaurantDetails["Name"],
              },
            },
          ],
        },
        "Price Range": {
          multi_select: [
            {
              name: restaurantDetails["Price Range"],
            },
          ],
        },
        "Cuisine Type": {
          multi_select: [
            {
              name: restaurantDetails["Cuisine Type"],
            },
          ],
        },
        Open: {
          checkbox: restaurantDetails["Open"],
        },
        Location: {
          rich_text: [
            {
              text: {
                content: String(restaurantDetails["Location"]),
              },
            },
          ],
        },
        Rating: {
          number: restaurantDetails["Rating"],
        },
        "Distance (miles)": {
          number: parseFloat(restaurantDetails["Distance"].slice(0, -3)),
        },
        Duration: {
          rich_text: [
            {
              text: {
                content: restaurantDetails["Duration"],
              },
            },
          ],
        },
      },
    });

    console.log("Notion entry created successfully:", response);
  } catch (error) {
    console.error("Error creating Notion entry:", error);
  }
}

// module.exports = sampleNotionFunction;

// Test notion api example
// const details = {
//   Name: "Driftwood Deli and Market",
//   "Price Range": "$$",
//   "Cuisine Type": "Indian",
//   Open: "Mon-Sun: 11:00 AM - 10:00 PM",
//   Rating: 4.5,
//   Location: "872 Sycamore",
// };

// console.log(createNotionEntry(details));

// MAPS

// EXPRESS

app.post("/add-restaurant", async (req, res) => {
  try {
    const { restaurantName, restaurantCity } = req.body;

    // Call getRestaurantDetails and createNotionEntry
    const restaurantDetails = await getRestaurantDetails(
      restaurantName,
      restaurantCity
    );

    console.log(restaurantDetails);

    await createNotionEntry(restaurantDetails);

    res.send("Restaurant details added to Notion successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding restaurant details to Notion");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
