import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

const RestaurantDetails = ({ userRole }) => {
    const { id } = useParams();
    const restaurantId = parseInt(id, 10);

    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [reviewText, setReviewText] = useState("");
    const [reviewRating, setReviewRating] = useState(5);
    const [reviews, setReviews] = useState([]);
    // State to store images selected for the review
    const [newImages, setNewImages] = useState([]);

    useEffect(() => {
        const fetchRestaurantDetails = async () => {
            const token = localStorage.getItem("jwtToken");
            try {
                const response = await axios.get(`${apiUrl}/api/restaurants/${restaurantId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRestaurant(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.response?.data?.message || error.message);
                setLoading(false);
            }
        };

        const fetchAllReviews = async () => {
            const token = localStorage.getItem("jwtToken");
            try {
                const response = await axios.get(`${apiUrl}/api/reviews/restaurant/${restaurantId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setReviews(response.data);
            } catch (error) {
                console.error("Error fetching reviews:", error.response?.data || error.message);
            }
        };

        fetchRestaurantDetails();
        fetchAllReviews();
    }, [restaurantId]);

    const addReview = async (restaurantId, newReview) => {
        const token = localStorage.getItem("jwtToken");
        const formData = new FormData();

        // Construct the review data
        formData.append("review", JSON.stringify(newReview));

        // Append images if any
        newImages.forEach((image) => formData.append("newImages", image));

        try {
            const response = await axios.post(
                `${apiUrl}/api/reviews/${restaurantId}/reviews`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data", // Send data as multipart
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Review submitted successfully!");
            setRestaurant((prev) => ({
                ...prev,
                reviews: [...(prev.reviews || []), response.data],
            }));
        } catch (error) {
            console.error("Error adding review:", error.response?.data || error.message);
            alert("Failed to add review. Please try again.");
        }
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();

        // Construct the payload in the required format
        const newReview = {
            rating: reviewRating,
            comment: reviewText, // Rename `text` to `comment`
        };

        // Call the `addReview` function with the correctly formatted payload
        addReview(restaurantId, newReview);

        // Clear the form fields after submission
        setReviewText("");
        setReviewRating(5);
        setNewImages([]); // Optionally clear selected images
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

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
                                <a
                                    key={index}
                                    href={photo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        src={photo}
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
                        {reviews?.length > 0 ? (
                            reviews.map((review, index) => (
                                <div key={index} className="mb-4 border p-4 rounded">
                                    <p>{review.comment}</p>
                                    <p><strong>Rating:</strong> {review.rating}</p>
//                                    <p><strong>Date:</strong> {review.date}</p>
                                </div>
                            ))
                        ) : (
                            <p>No reviews yet.</p>
                        )}
                    </div>

                    {/* Add Review Form */}
                    <div className="mt-6">
                        <form onSubmit={handleReviewSubmit}>
                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="Write a review..."
                                className="w-full p-2 border rounded"
                                required
                            />
                            <div className="mt-2">
                                <select
                                    value={reviewRating}
                                    onChange={(e) => setReviewRating(parseInt(e.target.value, 10))}
                                    className="p-2 border rounded"
                                >
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <option key={rating} value={rating}>
                                            {rating} Stars
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* File input for images */}
                            <div className="mt-2">
                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) => setNewImages(Array.from(e.target.files))}
                                    className="p-2 border rounded"
                                />
                            </div>

                            <button
                                type="submit"
                                className="mt-2 p-2 bg-blue-500 text-white rounded"
                            >
                                Submit Review
                            </button>
                        </form>
                    </div>
                </>
            ) : (
                <p>Restaurant not found.</p>
            )}
        </div>
    );
};

export default RestaurantDetails;

