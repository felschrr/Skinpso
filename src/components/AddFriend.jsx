import React, { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase.js";
import { useSocial } from "../context/SocialContext.jsx";
import { Link } from "react-router-dom";

const AddFriend = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const { addContact } = useSocial();

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
            setSearchTerm("");
        }
    };

    const handleAddContact = async (contactDetails) => {
        await addContact(contactDetails);
    };
    return (
        <>
            <form onSubmit={handleSearchContacts} className="mt-4">
                <h2 className="mb-2 text-xl font-bold dark:text-white">
                    Ajouter un contact
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
                searchResults.map((result, i) => (
                    <div key={result.uid} className="mt-2">
                            <Link
                                to={`/user/${result.uid}`}
                                className="flex items-center mb-2 text-blue-500 hover:text-blue-700"
                            >
                                <img
                                    src={result.photoURL}
                                    className="w-8 h-8 mr-2 rounded"
                                    alt={
                                        "Photo de profil de " +
                                        result.displayName
                                    }
                                />
                                <span>{result.displayName}</span>
                            </Link>
                        <button
                            onClick={() => handleAddContact(result)}
                            className="px-4 py-2 text-white bg-green-500 rounded"
                        >
                            Ajouter
                        </button>
                    </div>
                ))}
        </>
    );
};

export default AddFriend;
