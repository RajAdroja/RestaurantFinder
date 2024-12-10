import React, { useState } from "react";
import axios from "axios";

const EditListingModal = ({ listing, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: listing.name,
        address: listing.address,
        zipCode: listing.zipCode,
        description: listing.description,
        cuisine: listing.cuisine || "",
        foodType: listing.foodType || "",
        priceLevel: listing.priceLevel || "",
        photos: listing.photos || [], // Existing photos
        imagesToRemove: [], // Photos to be removed
        newImages: [], // Photos to be uploaded
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setFormData((prev) => ({
                ...prev,
                newImages: [...prev.newImages, ...Array.from(files)],
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Handle removing an existing photo
    const handleRemovePhoto = (photoUrl) => {
        setFormData((prev) => ({
            ...prev,
            imagesToRemove: [...prev.imagesToRemove, photoUrl],
            photos: prev.photos.filter((photo) => photo !== photoUrl),
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare FormData for the API call
        const formDataToSubmit = new FormData();
        formDataToSubmit.append("restaurant", JSON.stringify({
            name: formData.name,
            address: formData.address,
            pincode: formData.pincode,
            description: formData.description,
            cuisineType: formData.cuisineType,
            foodType: formData.foodType,
            priceLevel: formData.priceLevel,
            imagesToRemove: formData.imagesToRemove,
        }));

        // Append new images to the FormData
        formData.newImages.forEach((image) => {
            formDataToSubmit.append("newImages", image);
        });

        try {
            await axios.put(
                `${apiUrl}/api/restaurants/${listing.id}`,
                formDataToSubmit,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // Include token if required
                    },
                }
            );
            alert("Restaurant updated successfully!");
            onSubmit(); // Trigger the parent callback to refresh data
            onClose(); // Close the modal
        } catch (error) {
            console.error("Error updating restaurant:", error);
            alert("Failed to update restaurant. Please try again.");
        }
    };

    return (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="modal-content bg-white p-6 rounded-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Edit Listing</h2>
                <form onSubmit={handleSubmit}>
                    {/* Editable fields */}
                    <input
                        type="text"
                        name="name"
                        placeholder="Restaurant Name"
                        className="border p-2 w-full mb-2"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        className="border p-2 w-full mb-2"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="zipCode"
                        placeholder="ZIP Code"
                        className="border p-2 w-full mb-2"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        className="border p-2 w-full mb-2"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                    <select
                        name="cuisine"
                        className="border p-2 w-full mb-2"
                        value={formData.cuisine}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Type of Cuisine</option>
                        <option value="ITALIAN">Italian</option>
                        <option value="INDIAN">Indian</option>
                        <option value="CHINESE">Chinese</option>
                        <option value="MEXICAN">Mexican</option>
                        <option value="AMERICAN">American</option>
                    </select>
                    <select
                        name="foodType"
                        className="border p-2 w-full mb-2"
                        value={formData.foodType}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Type of Food</option>
                        <option value="VEGAN">Vegan</option>
                        <option value="VEGETARIAN">Vegetarian</option>
                        <option value="NON_VEGETARIAN">Non-Vegetarian</option>
                    </select>
                    <select
                        name="priceRange"
                        className="border p-2 w-full mb-2"
                        value={formData.priceRange}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Average Price Range</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                    </select>

                    {/* Existing Photos */}
                    <div className="grid grid-cols-3 gap-2 mt-4">
                        {formData.photos.map((photo, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={photo}
                                    alt={`Photo ${index + 1}`}
                                    className="w-full h-24 object-cover rounded shadow-md"
                                />
                                <button
                                    type="button"
                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs"
                                    onClick={() => handleRemovePhoto(photo)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Add New Images */}
                    <input
                        type="file"
                        multiple
                        name="newImages"
                        className="border p-2 w-full mb-2"
                        onChange={handleChange}
                        accept="image/*"
                    />

                    <button
                        type="submit"
                        className="bg-green-600 text-white p-2 rounded w-full"
                    >
                        Save Changes
                    </button>
                </form>
                <button
                    onClick={onClose}
                    className="text-red-600 hover:underline mt-4 block text-center"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default EditListingModal;
