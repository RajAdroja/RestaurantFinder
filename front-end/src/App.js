import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import BusinessOwnerDashboard from "./pages/BusinessOwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import RestaurantDetails from "./pages/RestaurantDetails";
import UserRestaurantDetails from "./pages/UserRestaurantDetails";

const App = () => {
    const [listings, setListings] = useState([
        {
            id: 1,
            name: "The Food Place",
            address: "123 Main St",
            zipCode: "94016",
            description: "Best food in town!",
            category: "Italian",
            photos: [],
            owner: "business@example.com",
        },
        {
            id: 2,
            name: "Vegan Delight",
            address: "456 Oak Ave",
            zipCode: "94017",
            description: "Delicious vegan options!",
            category: "Vegan",
            photos: [],
            owner: "business@example.com",
        },
    ]);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState("");

    const [reviews, setReviews] = useState({
        1: [{ text: "Great place!", rating: 5, user: "user1@example.com" }],
        2: [],
    });

    const addOrUpdateReview = (restaurantId, review) => {
        setReviews((prev) => ({
            ...prev,
            [restaurantId]: [
                ...prev[restaurantId].filter((r) => r.user !== review.user), // Remove existing review by the same user
                review,
            ],
        }));
    };

    const updateListing = (updatedListing) => {
        setListings((prevListings) =>
            prevListings.map((listing) =>
                listing.id === updatedListing.id ? updatedListing : listing
            )
        );
    };

    const deleteListing = (listingId) => {
        setListings((prevListings) =>
            prevListings.filter((listing) => listing.id !== listingId)
        );
    };

    const addListing = (newListing) => {
        setListings((prevListings) => [...prevListings, newListing]);
    };

    return (
        <Router>
            <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route
                    path="/login"
                    element={<Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />}
                />
                <Route
                    path="/user/dashboard"
                    element={<UserDashboard listings={listings} />}
                />
                <Route
                    path="/business/dashboard"
                    element={
                        <BusinessOwnerDashboard
                            listings={listings}
                            reviews={reviews}
                            updateListing={updateListing}
                            deleteListing={deleteListing}
                            addListing={addListing}
                        />
                    }
                />
                <Route
                    path="/admin/dashboard"
                    element={<AdminDashboard listings={listings} />}
                />
                <Route
                    path="/restaurant/:id"
                    element={
                        <RestaurantDetails
                            listings={listings}
                            reviews={reviews}
                            addOrUpdateReview={addOrUpdateReview}
                            userRole={userRole}
                        />
                    }
                />
                <Route
                    path="/user/restaurant/:id"
                    element={
                        <UserRestaurantDetails
                            listings={listings}
                            reviews={reviews}
                            addOrUpdateReview={addOrUpdateReview}
                        />
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
