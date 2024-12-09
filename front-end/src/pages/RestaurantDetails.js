import React from "react";
import { useParams } from "react-router-dom";

const RestaurantDetails = ({ listings, reviews, addReview, userRole }) => {
    const { id } = useParams();
    const restaurantId = parseInt(id, 10);
    const restaurant = listings.find((r) => r.id === restaurantId);

    const [reviewText, setReviewText] = React.useState("");
    const [reviewRating, setReviewRating] = React.useState(5);

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        const newReview = { text: reviewText, rating: reviewRating, date: new Date().toLocaleDateString() };
        addReview(restaurantId, newReview);
        setReviewText("");
        setReviewRating(5);
    };

    return (
        <div className="p-6">
            {restaurant ? (
                <>
                    <h1 className="text-4xl font-bold mb-4">{restaurant.name}</h1>
                    <p>Address: {restaurant.address}</p>
                    <p>Description: {restaurant.description}</p>
                    <p>Category: {restaurant.category}</p>

                    {/* Display Photos */}
                    {restaurant.photos && restaurant.photos.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-4">
                            {restaurant.photos.map((photo, index) => (
                                <a
                                    key={index}
                                    href={typeof photo === "string" ? photo : URL.createObjectURL(photo)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        src={typeof photo === "string" ? photo : URL.createObjectURL(photo)}
                                        alt={`Restaurant Photo ${index + 1}`}
                                        className="w-full h-24 object-cover rounded cursor-pointer"
                                    />
                                </a>
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
                                    <p>Rating: {review.rating}</p>
                                    <p>Date: {review.date}</p>
                                </div>
                            ))
                        ) : (
                            <p>No reviews yet.</p>
                        )}
                    </div>

                    {/* Add Review Form (Only for Users, Not Business Owners) */}
                    {userRole === "user" && (
                        <form onSubmit={handleReviewSubmit} className="mt-6">
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
                            <button className="bg-blue-600 text-white p-2 rounded">
                                Submit Review
                            </button>
                        </form>
                    )}
                </>
            ) : (
                <p>Restaurant not found.</p>
            )}
        </div>
    );
};

export default RestaurantDetails;
