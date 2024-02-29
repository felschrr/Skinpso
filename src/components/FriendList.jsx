import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useUser } from "../context/UserContext.jsx";
import { useSocial } from "../context/SocialContext.jsx";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase.js";

const FriendList = () => {
    const { user } = useAuth();
    const { addContact } = useSocial();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleInputChange = (setValue) => (e) => {
        setValue(e.target.value);
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
            <div className="friendlist"></div>

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

export default FriendList;
