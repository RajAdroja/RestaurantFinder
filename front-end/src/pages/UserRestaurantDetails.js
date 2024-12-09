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
                    <p><strong>Address:</strong> {restaurant.address}, {restaurant.zipCode}</p>
                    <p><strong>Description:</strong> {restaurant.description}</p>
                    <p><strong>Category:</strong> {restaurant.cuisine}</p>
                    <p><strong>Type of Food:</strong> {restaurant.foodType}</p>
                    <p><strong>Price Range:</strong> {restaurant.priceRange}</p>

                    {/* Display Photos */}
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

                    {/* Reviews Section */}
                    <div className="mt-6">
                        <h2 className="text-2xl font-bold mb-4">Reviews:</h2>
                        {reviews[restaurantId]?.length > 0 ? (
                            reviews[restaurantId].map((review, index) => (
                                <div key={index} className="mb-4 border p-4 rounded">
                                    <p>{review.text}</p>
                                    <p><strong>Rating:</strong> {review.rating}</p>
                                    <p><strong>Date:</strong> {review.date}</p>
                                    <p><strong>User:</strong> {review.user}</p>
                                </div>
                            ))
                        ) : (
                            <p>No reviews yet.</p>
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
