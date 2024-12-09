import React, { useState } from "react";
import { useParams } from "react-router-dom";

const UserRestaurantDetails = ({ listings, reviews, addOrUpdateReview }) => {
    const { id } = useParams();
    const restaurantId = parseInt(id, 10);
    const restaurant = listings.find((r) => r.id === restaurantId);

    const [currentUser] = useState("current_user@example.com"); // Mock logged-in user email
    const [reviewText, setReviewText] = useState("");
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewImage, setReviewImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const existingReview = reviews[restaurantId]?.find((r) => r.user === currentUser);

    const handleReviewSubmit = (e) => {
        e.preventDefault();

        if (reviewImage && reviewImage.size > 2 * 1024 * 1024) {
            alert("Image size should not exceed 2MB.");
            return;
        }

        const newReview = {
            text: reviewText,
            rating: reviewRating,
            image: reviewImage ? URL.createObjectURL(reviewImage) : null,
            user: currentUser,
            date: new Date().toLocaleDateString(),
        };

        addOrUpdateReview(restaurantId, newReview);
        setReviewText("");
        setReviewRating(5);
        setReviewImage(null);
        setIsEditing(false);
    };

    return (
        <div className="p-6">
            {restaurant ? (
                <>
                    <h1 className="text-4xl font-bold mb-4">{restaurant.name}</h1>
                    <p>Address: {restaurant.address}</p>
                    <p>Description: {restaurant.description}</p>
                    <p>Category: {restaurant.category}</p>

                    {/* Display Existing Reviews */}
                    <div className="mt-6">
                        <h2 className="text-2xl font-bold mb-4">Reviews:</h2>
                        {reviews[restaurantId]?.length > 0 ? (
                            reviews[restaurantId].map((review, index) => (
                                <div key={index} className="mb-4 border p-4 rounded">
                                    <p>{review.text}</p>
                                    <p>Rating: {review.rating}</p>
                                    <p>Date: {review.date}</p>
                                    <p>User: {review.user}</p>
                                    {review.image && (
                                        <a
                                            href={review.image}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <img
                                                src={review.image}
                                                alt="User Review Image"
                                                className="w-full h-24 object-cover rounded mt-2"
                                            />
                                        </a>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No reviews yet.</p>
                        )}
                    </div>

                    {/* Add or Edit Review */}
                    <div className="mt-6">
                        {existingReview && !isEditing ? (
                            <button
                                onClick={() => {
                                    setReviewText(existingReview.text);
                                    setReviewRating(existingReview.rating);
                                    setIsEditing(true);
                                }}
                                className="bg-yellow-500 text-white p-2 rounded"
                            >
                                Edit Your Review
                            </button>
                        ) : (
                            <form onSubmit={handleReviewSubmit} className="border p-4 rounded">
                                <textarea
                                    className="border p-2 w-full mb-4"
                                    placeholder="Write your review..."
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                />
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    className="border p-2 w-full mb-4"
                                    value={reviewRating}
                                    onChange={(e) => setReviewRating(e.target.value)}
                                    placeholder="Rating (1-5)"
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="border p-2 w-full mb-4"
                                    onChange={(e) => setReviewImage(e.target.files[0])}
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white p-2 rounded w-full"
                                >
                                    {existingReview ? "Update Review" : "Submit Review"}
                                </button>
                            </form>
                        )}
                    </div>
                </>
            ) : (
                <p>Restaurant not found.</p>
            )}
        </div>
    );
};

export default UserRestaurantDetails;
