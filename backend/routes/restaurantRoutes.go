package routes

import (
	"restaurant-finder-backend/controllers"

	"github.com/gorilla/mux"
)

func RegisterRestaurantRoutes(router *mux.Router) {
	// Route to add a restaurant
	router.HandleFunc("/restaurants", controllers.AddRestaurant).Methods("POST")
}
