package main

import (
	"log"
	"net/http"
	"restaurant-finder-backend/controllers"

	"github.com/gorilla/mux"
)

func main() {
	// Create a new router using Gorilla Mux
	router := mux.NewRouter()

	// Define routes and handlers here
	router.HandleFunc("/restaurants", controllers.GetRestaurants).Methods("GET")
	router.HandleFunc("/restaurant/{id}", controllers.GetRestaurantByID).Methods("GET")
	router.HandleFunc("/restaurants", controllers.AddRestaurant).Methods("POST")

	// Start the server on port 8000
	log.Println("Server starting on port 8000...")
	log.Fatal(http.ListenAndServe(":8000", router))
}
