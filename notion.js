// Create a new page in the specified database
const { Client } = require("@notionhq/client");
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
          rich_text: [
            {
              text: {
                content: restaurantDetails["Open"],
              },
            },
          ],
        },
        Location: {
          rich_text: [
            {
              text: {
                content: restaurantDetails["Location"],
              },
            },
          ],
        },
        Rating: {
          number: restaurantDetails["Rating"],
        },
      },
    });

    console.log("Notion entry created successfully:", response);
  } catch (error) {
    console.error("Error creating Notion entry:", error);
  }
}

// module.exports = sampleNotionFunction;

// Create data to pass to function
// Restaurant details obtained from get_restaurant_details
const details = {
  Name: "Driftwood Deli and Market",
  "Price Range": "$$",
  "Cuisine Type": "Indian",
  Open: "Mon-Sun: 11:00 AM - 10:00 PM",
  Rating: 4.5,
  Location: "872 Sycamore",
};

// // Call the function to create the Notion entry
console.log(createNotionEntry(details));

// window.createNotionEntry = createNotionEntry;

// module.exports = {
//   createNotionEntry,
// };
// module.exports = createNotionEntry;
