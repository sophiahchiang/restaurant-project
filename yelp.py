import requests
import json
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={r"/get-restaurant-details": {"origins": "http://127.0.0.1:5500"}})


# Replace 'YOUR_API_KEY' with your actual Yelp Fusion API key
api_key = "PpvUN9UiZ9_dvYu43ypQFT5bOjfOFttwyuNkQvSOnti14li3MdCbFpBPFvhqQu5EMSCoU3rnLqhCTTUJ9k-Sq4Q8l5TmAcVOX5H7VsBGnbW9L5Xwx-S4QX9OhS7yZHYx"

# Define the Yelp Fusion API endpoint for business search
endpoint = "https://api.yelp.com/v3/businesses/search"

# Define the parameters for the API request


def get_restaurant_details(restaurant_name, location):
    # You've got to enter it in with name and location
    params = {
        "term": restaurant_name,  # Replace with the restaurant name you want to search
        "location": location,  # Replace with a specific location if needed
        "limit": 1,  # Limit to 1 result, assuming the restaurant name is unique
    }

    # Define the headers with your API key
    headers = {
        "Authorization": f"Bearer {api_key}",
    }

    try:
        # Send the API request
        response = requests.get(endpoint, params=params, headers=headers)

        # print(response.text)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            data = response.json()
            if "businesses" in data and len(data["businesses"]) > 0:
                business = data["businesses"][0]  # Assuming we found a match
                name = business.get("name")
                print(name)
                rating = business.get("rating")
                price_range = business.get("price", "N/A")
                cuisine_type = business.get("categories", [{"title": "N/A"}])[0][
                    "title"
                ]
                # hours = business.get("hours", [{"open": []}])
                isclosed = business.get("is_closed")
                location = business.get("coordinates")
                restaurant_details = {
                    "Name": name,
                    "Rating": rating,
                    "Price Range": price_range,
                    "Cuisine Type": cuisine_type,
                    "Open": not isclosed,
                    # "Hours Open": hours[0]["open"] if hours else "N/A",
                    "Location": location,
                }
                return restaurant_details
                # print("Restaurant Details:")
                # for key, value in restaurant_details.items():
                #     print(f"{key}: {value}")
            else:
                print("Restaurant not found on Yelp")
        else:
            print("Yelp API request failed")
    except Exception as e:
        print(f"An error occurred: {str(e)}")


print(get_restaurant_details("Driftwood Deli and Market", "Palo Alto"))


@app.route("/get-restaurant-details", methods=["POST"])
def get_restaurant_details_from_frontend():
    data = request.get_json()
    restaurant_name = data.get("restaurantName")
    restaurant_city = data.get("restaurantCity")

    # Call the get_restaurant_details function with the received values
    restaurant_details = get_restaurant_details(restaurant_name, restaurant_city)

    # Return the restaurant_details as JSON response
    return jsonify(restaurant_details)


if __name__ == "__main__":
    app.run()
