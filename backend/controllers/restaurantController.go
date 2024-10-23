package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type Restaurant struct {
	ID         int     `json:"id"`
	Name       string  `json:"name"`
	Address    string  `json:"address"`
	Category   string  `json:"category"`
	PriceRange string  `json:"price_range"`
	Rating     float64 `json:"rating"`
	OwnerID    int     `json:"owner_id"`
}

// In-memory slice to store restaurants
var restaurants []Restaurant
var nextID int // For assigning unique IDs

func AddRestaurant(w http.ResponseWriter, r *http.Request) {
	var restaurant Restaurant

	// Decode the JSON request body
	if err := json.NewDecoder(r.Body).Decode(&restaurant); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	nextID++
	restaurant.ID = nextID
	// Append the new restaurant to the slice
	restaurants = append(restaurants, restaurant)

	// Respond with the added restaurant
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(restaurant)
}

func GetRestaurants(w http.ResponseWriter, r *http.Request) {
	// Return the list of restaurants
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(restaurants)
}

func GetRestaurantByID(w http.ResponseWriter, r *http.Request) {
	// Get the ID from the request variables
	vars := mux.Vars(r)
	idStr := vars["id"] // This is a string

	// Convert the string ID to an integer
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid restaurant ID", http.StatusBadRequest)
		return
	}

	// Search for the restaurant by ID
	for _, restaurant := range restaurants {
		if restaurant.ID == id { // Compare the integer IDs
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(restaurant)
			return
		}
	}

	// If not found, return a 404 error
	http.Error(w, "Restaurant not found", http.StatusNotFound)
}
