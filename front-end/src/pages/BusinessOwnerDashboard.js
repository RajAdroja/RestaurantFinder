import React, { useState } from "react";
import EditListingModal from "../components/EditListingModal";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
const BusinessOwnerDashboard = ({ listings, updateListing, deleteListing, addListing }) => {
    const [editListing, setEditListing] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newListing, setNewListing] = useState({
        name: "",
        address: "",
        zipCode: "",
        description: "",
        cuisine: "",
        foodType: "",
        priceRange: "",
        photos: [],
    });

    const navigate = useNavigate();

    const handleAddListingChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            if (files.length + newListing.photos.length > 6) {
                alert("You can upload a maximum of 6 photos.");
                return;
            }
            setNewListing((prev) => ({
                ...prev,
                photos: [...prev.photos, ...Array.from(files)],
            }));
        } else {
            setNewListing((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleAddListingSubmit = async () => {
        const formData = new FormData();
        formData.append("restaurant", JSON.stringify(newListing));
        newListing.photos.forEach((photo) => formData.append("images", photo));
      
        try {
          await axios.post("http://localhost:8080/api/restaurants/add", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          alert("Restaurant added successfully!");
        } catch (error) {
          console.error("Error adding restaurant:", error);
        }
      };

      const handleDeleteListing = async (id) => {
        try {
          await axios.delete(`http://localhost:8080/api/restaurants/${id}`);
          alert("Restaurant deleted successfully!");
        } catch (error) {
          console.error("Error deleting restaurant:", error);
        }
      };

      const handleEditSubmit = async (updatedListing) => {
        const formData = new FormData();
        formData.append("restaurant", JSON.stringify(updatedListing));
        updatedListing.photos.forEach((photo) => formData.append("newImages", photo));
      
        try {
          await axios.put(`http://localhost:8080/api/restaurants/${updatedListing.id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          alert("Restaurant updated successfully!");
        } catch (error) {
          console.error("Error updating restaurant:", error);
        }
      };

    const viewRestaurantDetails = (restaurantId) => {
        navigate(`/restaurant/${restaurantId}`);
    };

    return (
        <div className="p-6">
            <h1 className="text-4xl font-bold mb-4">Business Owner Dashboard</h1>

            <button
                onClick={() => setShowAddModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded mb-4"
            >
                Add Listing
            </button>

            <ul className="space-y-4">
                {listings.map((restaurant) => (
                    <li key={restaurant.id} className="border p-4 rounded">
                        <h3 className="text-lg font-bold">{restaurant.name}</h3>
                        <p>Address: {restaurant.address}</p>
                        <p>ZIP Code: {restaurant.zipCode}</p>
                        <p>Description: {restaurant.description}</p>
                        <p>Category: {restaurant.cuisine}</p>
                        <p>Type of Food: {restaurant.foodType}</p>
                        <p>Price Range: {restaurant.priceRange}</p>

                        {restaurant.photos && restaurant.photos.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mt-4">
                                {restaurant.photos.map((photo, index) => (
                                    <img
                                        key={index}
                                        src={typeof photo === "string" ? photo : URL.createObjectURL(photo)}
                                        alt={`Photo ${index + 1}`}
                                        className="w-full h-24 object-cover rounded"
                                    />
                                ))}
                            </div>
                        )}

                        <div className="mt-4">
                            <button
                                onClick={() => setEditListing(restaurant)}
                                className="bg-yellow-500 text-white p-2 rounded mr-2"
                            >
                                Edit Listing
                            </button>
                            <button
                                onClick={() => deleteListing(restaurant.id)}
                                className="bg-red-500 text-white p-2 rounded"
                            >
                                Delete Listing
                            </button>
                            <button
                                onClick={() => viewRestaurantDetails(restaurant.id)}
                                className="bg-blue-500 text-white p-2 rounded ml-2"
                            >
                                View Details
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Modal for Adding New Listing */}
            {showAddModal && (
                <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="modal-content bg-white p-6 rounded-md w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Add New Listing</h2>
                        <form onSubmit={handleAddListingSubmit}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Restaurant Name"
                                className="border p-2 w-full mb-2"
                                value={newListing.name}
                                onChange={handleAddListingChange}
                                required
                            />
                            <input
                                type="text"
                                name="address"
                                placeholder="Address"
                                className="border p-2 w-full mb-2"
                                value={newListing.address}
                                onChange={handleAddListingChange}
                                required
                            />
                            <input
                                type="text"
                                name="zipCode"
                                placeholder="ZIP Code"
                                className="border p-2 w-full mb-2"
                                value={newListing.zipCode}
                                onChange={handleAddListingChange}
                                required
                            />
                            <textarea
                                name="description"
                                placeholder="Description"
                                className="border p-2 w-full mb-2"
                                value={newListing.description}
                                onChange={handleAddListingChange}
                                required
                            />
                            <select
                                name="cuisine"
                                className="border p-2 w-full mb-2"
                                value={newListing.cuisine}
                                onChange={handleAddListingChange}
                                required
                            >
                                <option value="">Type of Cuisine</option>
                                <option value="Italian">Italian</option>
                                <option value="Indian">Indian</option>
                                <option value="Chinese">Chinese</option>
                                <option value="Korean">Korean</option>
                                <option value="American">American</option>
                                <option value="Japanese">Japanese</option>
                            </select>
                            <select
                                name="foodType"
                                className="border p-2 w-full mb-2"
                                value={newListing.foodType}
                                onChange={handleAddListingChange}
                                required
                            >
                                <option value="">Type of Food</option>
                                <option value="Vegan">Vegan</option>
                                <option value="Vegetarian">Vegetarian</option>
                                <option value="Non-Vegetarian">Non-Vegetarian</option>
                            </select>
                            <select
                                name="priceRange"
                                className="border p-2 w-full mb-2"
                                value={newListing.priceRange}
                                onChange={handleAddListingChange}
                                required
                            >
                                <option value="">Average Price Range</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                            <input
                                type="file"
                                multiple
                                name="photos"
                                className="border p-2 w-full mb-2"
                                onChange={handleAddListingChange}
                                accept="image/*"
                            />
                            <button
                                type="submit"
                                className="bg-green-600 text-white p-2 rounded w-full"
                            >
                                Add Listing
                            </button>
                        </form>
                        <button
                            onClick={() => setShowAddModal(false)}
                            className="text-red-600 hover:underline mt-4 block text-center"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Modal for Editing Listing */}
            {editListing && (
                <EditListingModal
                    listing={editListing}
                    onClose={() => setEditListing(null)}
                    onSubmit={handleEditSubmit}
                />
            )}
        </div>
    );
};

export default BusinessOwnerDashboard;
