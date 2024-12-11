import React, { useState, useEffect } from "react";
import EditListingModal from "../components/EditListingModal";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

const BusinessOwnerDashboard = () => {
    const [restaurantListings, setRestaurantListings] = useState([]); // State to hold fetched restaurants
    const [editListing, setEditListing] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newListing, setNewListing] = useState({
        name: "",
        address: "",
        pincode: "",
        description: "",
        cuisineType: "",
        foodType: "",
        priceLevel: "",
        photos: [],
    });

    const navigate = useNavigate();

    // Fetch listings when the component is mounted
    useEffect(() => {
        fetchListings();
    }, []);

    // Fetch listings from the API
    const fetchListings = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            const response = await axios.get(`${apiUrl}/api/restaurants/owner`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setRestaurantListings(response.data); // Set fetched data to state
        } catch (error) {
            console.error("Error fetching restaurant listings:", error);
        }
    };

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

    const handleAddListingSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const { photos, ...restaurantData } = newListing;
        const token = localStorage.getItem("jwtToken");
        formData.append("restaurant", JSON.stringify(restaurantData));
        photos.forEach((photo) => formData.append("images", photo));

        try {
            await axios.post(`${apiUrl}/api/restaurants/add`, formData, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
            });
            alert("Restaurant added successfully!");
            setShowAddModal(false);
            fetchListings(); // Re-fetch listings after adding a new one
        } catch (error) {
            console.error("Error adding restaurant:", error.response?.data || error.message);
            alert("Failed to add restaurant. Please try again.");
        }
    };

    const handleDeleteListing = async (id) => {
        try {
            await axios.delete(`${apiUrl}/api/restaurants/delete/${id}`);
            alert("Restaurant deleted successfully!");
            fetchListings(); // Re-fetch listings after deletion
        } catch (error) {
            console.error("Error deleting restaurant:", error);
        }
    };

    const handleEditSubmit = async (updatedListing) => {
        const formData = new FormData();
        formData.append("restaurant", JSON.stringify(updatedListing));
        updatedListing.photos.forEach((photo) => formData.append("newImages", photo));

        try {
            await axios.put(`${apiUrl}/api/restaurants/${updatedListing.id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Restaurant updated successfully!");
            fetchListings(); // Re-fetch listings after updating
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
                {restaurantListings.map((restaurant) => (
                    <li key={restaurant.id} className="border p-4 rounded">
                        <h3 className="text-lg font-bold">{restaurant.name}</h3>
                        <p>Address: {restaurant.address}</p>
                        <p>ZIP Code: {restaurant.pincode}</p>
                        <p>Description: {restaurant.description}</p>
                        <p>Category: {restaurant.cuisineType}</p>
                        <p>Type of Food: {restaurant.foodType}</p>
                        <p>Price Range: {restaurant.priceLevel}</p>

                        {restaurant.photos && restaurant.photos.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mt-4">
                                {restaurant.photos.map((photo, index) => (
                                    <img
                                        key={index}
                                        src={typeof photo === "string" ? photo : URL.createObjectURL(photo)}
                                        alt={`Photo ${index + 1}`}
                                        className="w-full h-auto object-cover rounded shadow-md"
                                        style={{ maxHeight: "200px", maxWidth: "300px", objectFit: "cover" }}
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
                                onClick={() => handleDeleteListing(restaurant.id)}
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
                            {/* Add your form inputs here */}
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
                    onClose={() => window.location.reload()}
                    onSubmit={handleEditSubmit}
                />
            )}
        </div>
    );
};

export default BusinessOwnerDashboard;
