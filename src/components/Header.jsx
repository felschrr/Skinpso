import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
const Header = () => {
  const { logout, signInWithGoogle, user } = useContext(AuthContext);

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
      name: user ? "Profile" : null, // Ne rend rien si l'utilisateur n'est pas connecté
      path: user ? "/profile" : null,
    },
    {
      name: user ? "Logout" : "Login",
      path: user ? "/logout" : "/login",
    },
  ];

  return (
    <header className="py-4 mb-16 shadow-md dark:bg-gray-700 dark:text-white">
      <div className="flex items-center justify-between px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <ul className="flex space-x-4">
          {routes.map(
            (route) =>
              route.name && ( // Rend le lien uniquement si route.name n'est pas null
                <li key={route.path}>
                  {route.name === "Login" ? (
                    <button
                      className={`hover:text-gray-300 text-gray-800 dark:text-white`}
                      onClick={signInWithGoogle}
                    >
                      {route.name}
                    </button>
                  ) : route.name === "Logout" ? (
                    <button
                      className={`hover:text-gray-300 text-gray-800 dark:text-white`}
                      onClick={logout}
                    >
                      {route.name}
                    </button>
                  ) : (
                    <Link
                      to={route.path}
                      className={`hover:text-gray-300 text-gray-800 dark:text-white`}
                    >
                      {route.name}
                    </Link>
                  )}
                </li>
              )
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
