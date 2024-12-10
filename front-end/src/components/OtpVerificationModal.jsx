import React, { useState } from "react";
import axios from "axios";

const OtpVerificationModal = ({ onClose, email }) => {
    const [otp, setOtp] = useState("");

    const handleChange = (e) => {
        setOtp(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!otp) {
            alert("Please enter the OTP.");
            return;
        }

        try {
            const payload = { email, otp };
            await axios
                .post("http://localhost:8081/api/auth/verify-otp", payload)
                .then((response) => {
                    console.log("OTP verified successfully:", response.data);
                    alert("Your email has been verified successfully!");
                    onClose(); // Close the modal
                })
                .catch((error) => {
                    console.error(
                        "Error during OTP verification:",
                        error.response?.data?.message || error.message
                    );
                    alert("Invalid or expired OTP. Please try again.");
                });
        } catch (error) {
            console.error("Unexpected error during OTP verification:", error);
            alert("An unexpected error occurred. Please try again later.");
        }
    };

    return (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="modal-content bg-white p-6 rounded-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
                <p className="mb-4 text-gray-600">
                    We've sent an OTP to your email address. Please enter it
                    below to verify your account.
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="otp"
                        placeholder="Enter OTP"
                        className="border p-2 w-full mb-2"
                        value={otp}
                        onChange={handleChange}
                    />
                    <button
                        type="submit"
                        className="bg-green-600 text-white p-2 rounded w-full"
                    >
                        Verify OTP
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

export default OtpVerificationModal;
