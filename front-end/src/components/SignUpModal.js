import React, { useState } from "react";

const SignUpModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        zipCode: "",
        isBusinessOwner: false, // Default to User (Customer)
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { fullName, email, password, zipCode, isBusinessOwner } = formData;

        if (!fullName || !email || !password || !zipCode) {
            alert("Please fill out all required fields.");
            return;
        }

        const role = isBusinessOwner ? "Business Owner" : "User";
        alert(`Sign-up successful as ${role}!`);
        onClose();
    };

    return (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="modal-content bg-white p-6 rounded-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Sign up for MunchMap</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        className="border p-2 w-full mb-2"
                        value={formData.fullName}
                        onChange={handleChange}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="border p-2 w-full mb-2"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="border p-2 w-full mb-2"
                        value={formData.password}
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

                    {/* Checkbox to select Business Owner Registration */}
                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            name="isBusinessOwner"
                            id="isBusinessOwner"
                            className="mr-2"
                            checked={formData.isBusinessOwner}
                            onChange={handleChange}
                        />
                        <label htmlFor="isBusinessOwner">
                            Register as a Business Owner
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="bg-green-600 text-white p-2 rounded w-full"
                    >
                        Sign Up
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

export default SignUpModal;