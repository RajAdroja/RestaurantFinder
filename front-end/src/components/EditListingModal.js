import React, { useState } from "react";

const EditListingModal = ({ listing, onClose, onSubmit }) => {
    // Initialize state with existing listing data
    const [formData, setFormData] = useState({
        name: listing.name,
        address: listing.address,
        zipCode: listing.zipCode,
        description: listing.description,
        cuisine: listing.cuisine || "",
        foodType: listing.foodType || "",
        priceRange: listing.priceRange || "",
        photos: listing.photos || [],
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setFormData((prev) => ({
                ...prev,
                photos: [...prev.photos, ...Array.from(files)],
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...listing, ...formData });
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
                        value={formData.foodType}
                        onChange={handleChange}
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
                        value={formData.priceRange}
                        onChange={handleChange}
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
