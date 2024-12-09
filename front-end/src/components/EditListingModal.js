import React, { useState } from "react";

const EditListingModal = ({ listing, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: listing.name,
        address: listing.address,
        zipCode: listing.zipCode,
        photos: listing.photos || [],
    });

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

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...listing, ...formData });
    };

    return (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="modal-content bg-white p-6 rounded-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Edit Listing</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Restaurant Name"
                        className="border p-2 w-full mb-2"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        className="border p-2 w-full mb-2"
                        value={formData.address}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="zipCode"
                        placeholder="ZIP Code"
                        className="border p-2 w-full mb-2"
                        value={formData.zipCode}
                        onChange={handleChange}
                    />
                    <input
                        type="file"
                        multiple
                        name="photos"
                        className="border p-2 w-full mb-2"
                        onChange={handleChange}
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
