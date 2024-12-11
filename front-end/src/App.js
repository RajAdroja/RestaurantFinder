import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import BusinessOwnerDashboard from "./pages/BusinessOwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import RestaurantDetails from "./pages/RestaurantDetails";
import UserRestaurantDetails from "./pages/UserRestaurantDetails";
import FixDuplicateListings from "./components/FixDuplicateListings";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

const App = () => {
    const [listings, setListings] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState("");

    const [reviews, setReviews] = useState({
        1: [{ text: "Great place!", rating: 5, user: "user1@example.com" }],
        2: [],
    });

	const fetchListings = async () => {
                    try {
                        const response = await axios.get(`${apiUrl}/api/restaurants/owner`, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // Add token if required
                            },
                        });
                        setListings(response.data);
                        console.log(response.data)
                    } catch (error) {
                        console.error("Error fetching listings:", error);
                    }
                };
     const initializeData = async () => {
             setIsLoading(true);
             try {
                 await fetchListings();
             } finally {
                 setIsLoading(false); // Ensure loading state is reset
             }
         };
	useEffect(() => {
            const fetchListings = async () => {
                try {
                    const response = await axios.get(`${apiUrl}/api/restaurants/owner`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // Add token if required
                        },
                    });
                    setListings(response.data);
                } catch (error) {
                    console.error("Error fetching listings:", error);
                }
            };

            fetchListings();
        }, []);

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
        const token = localStorage.getItem("jwtToken"); // Retrieve the JWT token
                  if (!token) {
                      alert("User not authenticated. Please log in.");
                      return;
                  }

                try {
                  axios.delete(`${apiUrl}/api/restaurants/${listingId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Pass the JWT token
                        },
                    });
                  alert("Restaurant deleted successfully!");
                } catch (error) {
                  console.error("Error deleting restaurant:", error);
                }
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

                    {/* Add other routes as needed */}
                    <Route path="/admin/fix-duplicates" element={<FixDuplicateListings />}/>
                </Routes>
        </Router>
    );
};

export default App;
