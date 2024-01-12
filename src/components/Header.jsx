import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from '../context/AuthContext.jsx';

const Header = () => {
    const { user, logout, signInWithGoogle } = useContext(AuthContext);

    const routes = [
        {
            name: "Home",
            path: "/",
        },
        {
            name: user ? "Inventory" : null, // Ne rend rien si l'utilisateur n'est pas connecté
            path: user ? "/inventory" : null,
        },
        {
            name: user ? "Logout" : "Login",
            path: user ? "/logout" : "/login",
        },
    ];

    return (
        <ul>
            {routes.map((route) => (
                route.name && ( // Rend le lien uniquement si route.name n'est pas null
                    <li key={route.path}>
                        {route.name === "Login" ? (
                            <button onClick={signInWithGoogle}>{route.name}</button>
                        ) : route.name === "Logout" ? (
                            <button onClick={logout}>{route.name}</button>
                        ) : (
                            <Link to={route.path}>{route.name}</Link>
                        )}
                    </li>
                )
            ))}
        </ul>
    )
};

export default Header;
