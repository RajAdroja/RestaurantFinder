import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SignUpModal from "./SignUpModal";

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
    const navigate = useNavigate();
    const [showSignUp, setShowSignUp] = useState(false);

    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate("/");
    };

    return (
        <>
            <nav className="bg-green-600 p-4 text-white flex justify-between items-center">
                <div
                    className="font-bold text-xl cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    MunchMap
                </div>
                <div>
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 px-4 py-2 rounded text-white"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="bg-blue-600 px-4 py-2 rounded text-white mr-2"
                            >
                                Login
                            </Link>
                            <button
                                onClick={() => setShowSignUp(true)}
                                className="bg-yellow-500 px-4 py-2 rounded text-white"
                            >
                                Sign Up
                            </button>
                        </>
                    )}
                </div>
            </nav>

            {/* Sign Up Modal */}
            {showSignUp && <SignUpModal onClose={() => setShowSignUp(false)} />}
        </>
    );
};

export default Header;
