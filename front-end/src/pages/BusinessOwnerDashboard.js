import React, { useState } from "react";
import EditListingModal from "../components/EditListingModal";
import { useNavigate } from "react-router-dom";

const BusinessOwnerDashboard = ({ listings, updateListing, deleteListing, addListing }) => {
    const [editListing, setEditListing] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newListing, setNewListing] = useState({
        name: "",
        address: "",
        zipCode: "",
        description: "",
        category: "",
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

    const handleAddListingSubmit = (e) => {
        e.preventDefault();
        if (!newListing.name || !newListing.address || !newListing.category) {
            alert("Name, Address, and Category are required.");
            return;
        }
        addListing({ ...newListing, id: Date.now() });
        setNewListing({ name: "", address: "", zipCode: "", description: "", category: "", photos: [] });
        setShowAddModal(false);
    };

    const handleEditSubmit = (updatedListing) => {
        updateListing(updatedListing);
        setEditListing(null);
    };

    const viewRestaurantDetails = (restaurantId) => {
        navigate(`/restaurant/${restaurantId}`);
    };

    return (
        <div className="p-6">
            <h1 className="text-4xl font-bold mb-4">Business Owner Dashboard</h1>

            {/* Add Listing Button */}
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
                        <p>Category: {restaurant.category}</p>

                        {/* Display Photos */}
                        {restaurant.photos && restaurant.photos.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mt-4">
                                {restaurant.photos.map((photo, index) => (
                                    <img
                                        key={index}
                                        src={typeof photo === "string" ? photo : URL.createObjectURL(photo)} // Handle both File objects and existing URLs
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
                            />
                            <input
                                type="text"
                                name="address"
                                placeholder="Address"
                                className="border p-2 w-full mb-2"
                                value={newListing.address}
                                onChange={handleAddListingChange}
                            />
                            <input
                                type="text"
                                name="zipCode"
                                placeholder="ZIP Code"
                                className="border p-2 w-full mb-2"
                                value={newListing.zipCode}
                                onChange={handleAddListingChange}
                            />
                            <textarea
                                name="description"
                                placeholder="Description"
                                className="border p-2 w-full mb-2"
                                value={newListing.description}
                                onChange={handleAddListingChange}
                            />
                            <input
                                type="text"
                                name="category"
                                placeholder="Category"
                                className="border p-2 w-full mb-2"
                                value={newListing.category}
                                onChange={handleAddListingChange}
                            />
                            <input
                                type="file"
                                multiple
                                name="photos"
                                className="border p-2 w-full mb-2"
                                onChange={handleAddListingChange}
                            />
                            <button type="submit" className="bg-green-600 text-white p-2 rounded w-full">
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
