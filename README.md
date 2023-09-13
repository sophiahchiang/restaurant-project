# The Restaurant Project

The **Restaurant Project** was created to streamline the process of choosing and tracking restaurants. It came into being after I'd spent a summer in a new place and had a list of restaurants that I wanted to try that I kept on Notion. Everytime I was out and hungry, I'd consult the Notion, pick something that looked appealing, open Google Maps to figure out how far away the restaurant was, check Yelp or Google to make sure it was open and look at reviews, and finally make a decision. Sometimes I'd look up 4-5 restaurants before I found one that worked. I knew that there was an easier way, so I built this web app. By combining data from Yelp, Google Maps, and Notion, the "Restaurant Project" provides an efficient experience for users looking to explore their dining options and makes it easy to answer the question "Where should we eat?"

This README provides an overview of the project structure, APIs used, and instructions for running the application. Feel free to customize and extend the project to suit your specific restaurant-finding needs. The web app allows users to enter a restaurant name in a field within the Add tab. When a user clicks add, the application will automatically retrieve information about that restaurant from Yelp (such as rating, price, and cuisine type) and add it to a Notion database embedded in the webpage. Furthermore, the application will calculate the distance between the user's current location and the restaurants in the database, order the restaurants by proximity, and display both the restaurant locations and the user's location on a Google Map. 

Enjoy a more streamlined restaurant choosing experience!

## Project Structure

The project consists of the following files and components:

### Files

- **server.js**: This is the backend server file built using Express.js. It handles HTTP requests and responses, including fetching data from Yelp, interacting with the Notion API, and serving the web application.

- **client.js**: This JavaScript file handles the frontend logic of the web application, including user interface interactions, form submissions, and the display of restaurant data and Google Maps.

- **index.html**: The main HTML file that defines the structure and content of the web application. It embeds the Notion database, includes JavaScript files, and provides the user interface elements.

- **styles.css**: The stylesheet that defines the visual styling of the web application, including tabs, buttons, and overall layout.

### APIs Used

The project relies on the following external APIs to retrieve and process data:

- **Yelp Fusion API**: Used to search for restaurant details, including rating, price, and cuisine type, based on the user's input.

- **Google Maps JavaScript API**: Utilized to display a map on the "Map" tab, including markers for the selected restaurants and the user's location.

- **Google Maps Distance Matrix API**: Employed to calculate the distance and travel duration between the user's location and each selected restaurant.

- **Notion API**: Used to create entries in a Notion database, storing restaurant details such as name, price range, cuisine type, and location.

## How to Use

1. Clone the repository to your local machine.

```bash
git clone <repository-url>
```

2. Install the project dependencies.

```bash
cd <project-directory>
npm install
```

3. Configure API Keys and Notion database:

   - Replace `<Yelp-API-Key>` with your Yelp Fusion API key in `server.js`.
   - Replace `<Google-API-Key>` with your Google Maps API key in `index.html`.
   - Replace `<Notion-API-Key>` with your Notion API key in `server.js`.
   - Replace `Database_Id` in `server.js` with the database id of the Notion database you want to add restaurant entries to.

4. Start the server:

```bash
npm start
```

5. Access the web application:

   - Open the index.html page from Finder

6. Using the Application:

   - Click on the "List" tab to see the embedded Notion database with restaurant details.
   - Click on the "Map" tab to view the selected restaurants and your location on a Google Map.
   - Click on the "Add" tab to add a new restaurant by providing its name and city.
