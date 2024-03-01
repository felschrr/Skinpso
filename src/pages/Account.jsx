import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useUser } from "../context/UserContext.jsx";
import { FriendList, AddFriend } from "../components";

const Account = () => {
    const { user } = useAuth();
    const {
        currency,
        theme,
        visibility,
        setCurrency,
        setTheme,
        setVisibility,
    } = useUser();

    useEffect(() => {
        setCurrency(currency);
        setTheme(theme);
    }, [currency, theme, setCurrency, setTheme]);

    const handleInputChange = (setValue) => (e) => {
        setValue(e.target.value);
    };

    const handleCheckboxChange = (e) => {
        setVisibility(e.target.checked);
    };

    return (
        <div className="max-w-md p-6 mx-auto mt-8 bg-white border border-gray-200 rounded-md shadow-md dark:border-gray-600 dark:bg-gray-800">
            <div>
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                    Profil de l'utilisateur
                </h2>
                <img
                    className="w-24 h-24 mx-auto mb-4 rounded-full"
                    src={user.photoURL}
                    alt="Avatar de l'utilisateur"
                />
                <p className="text-gray-800 dark:text-gray-400">
                    <span className="font-semibold">Nom:</span>{" "}
                    {user.displayName}
                </p>
                <p className="text-gray-800 dark:text-gray-400">
                    <span className="font-semibold">Email:</span> {user.email}
                </p>
                <p className="text-gray-800 dark:text-gray-400">
                    <span className="font-semibold">Date d'inscription:</span>{" "}
                    {user.signInDate}
                </p>

                <div className="mt-6">
                    <label
                        htmlFor="currency"
                        className="block font-semibold text-gray-700 dark:text-gray-300"
                    >
                        Choisir la devise :
                    </label>
                    <select
                        id="currency"
                        value={currency}
                        onChange={handleInputChange(setCurrency)}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="CNY">CNY</option>
                    </select>
                </div>

                <div className="mt-4">
                    <label
                        htmlFor="theme"
                        className="block font-semibold text-gray-700 dark:text-gray-300"
                    >
                        Choisir le thème :
                    </label>
                    <select
                        id="theme"
                        value={theme}
                        onChange={handleInputChange(setTheme)}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="default">Défaut</option>
                        <option value="light">Clair</option>
                        <option value="dark">Sombre</option>
                    </select>
                </div>

                <div className="mt-4">
                    <label
                        htmlFor="visibility"
                        className="block font-semibold text-gray-700 dark:text-gray-300"
                    >
                        Visibilité du compte :
                    </label>
                    <input
                        type="checkbox"
                        id="visibility"
                        checked={visibility}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 mt-1 text-indigo-600 border-gray-300 rounded dark:text-white focus:ring-indigo-500"
                    />{" "}
                    <span className="text-gray-800 dark:text-gray-400">
                        {" "}
                        {visibility ? "Public" : "Privé"}
                    </span>
                </div>
            </div>
            <FriendList/>
            <AddFriend/>
        </div>
    );
};

export default Account;
