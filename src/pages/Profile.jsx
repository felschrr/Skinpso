import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../context/UserContext.jsx";
import { useSocial } from "../context/SocialContext.jsx";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

const Profile = () => {
  const { user } = useAuth();
  const { currency, theme, visibility, setCurrency, setTheme, setVisibility } = useUser();
  const { addContact } = useSocial();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

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

  const handleSearchContacts = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    try {
      const q = query(
        collection(db, "users"),
        where("displayName", "==", searchTerm.toLowerCase())
      );
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching contacts:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddContact = async (contactDetails) => {
    await addContact(contactDetails);
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
          <span className="font-semibold">Nom:</span> {user.displayName}
        </p>
        <p className="text-gray-800 dark:text-gray-400">
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p className="text-gray-800 dark:text-gray-400">
          <span className="font-semibold">Date d'inscription:</span>{" "}
          {user.signInDate}
        </p>

        <div className="mt-6">
          <label htmlFor="currency" className="block font-semibold text-gray-700 dark:text-gray-300">
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
          <label htmlFor="theme" className="block font-semibold text-gray-700 dark:text-gray-300">
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
          <label htmlFor="visibility" className="block font-semibold text-gray-700 dark:text-gray-300">
            Visibilité du compte :
          </label>
          <input
            type="checkbox"
            id="visibility"
            checked={visibility}
            onChange={handleCheckboxChange}
            className="w-4 h-4 mt-1 text-indigo-600 border-gray-300 rounded dark:text-white focus:ring-indigo-500"
          /> <span className="text-gray-800 dark:text-gray-400"> {visibility ? "Public" : "Privé" }</span>
        </div>
      </div>
      <form onSubmit={handleSearchContacts} className="mt-4">
        <h2 className="text-xl font-bold dark:text-white">
          Ajouter un contact :{" "}
        </h2>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange(setSearchTerm)}
          placeholder="Rechercher des contacts..."
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <button
          type="submit"
          className="px-4 py-2 mt-2 text-white bg-blue-500 rounded"
        >
          Rechercher
        </button>
      </form>

      {isSearching && <p>Recherche en cours...</p>}
      {!isSearching &&
        searchResults.map((result) => (
          <div key={result.uid} className="mt-2">
            <p>{result.displayName}</p>
            <button
              onClick={() => handleAddContact(result)}
              className="px-4 py-2 text-white bg-green-500 rounded"
            >
              Ajouter
            </button>
          </div>
        ))}
    </div>
  );
};

export default Profile;
