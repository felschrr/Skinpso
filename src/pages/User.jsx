import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const User = () => {
    const { userId } = useParams();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userRef = doc(db, "users", userId);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setUserData(userSnap.data());
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [userId]);

    return (
        <div className="max-w-md p-6 mx-auto mt-8 bg-white border border-gray-200 rounded-md shadow-md dark:border-gray-600 dark:bg-gray-800">
            <div>
                {userData ? (
                    <>
                        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                            Profil de l'utilisateur
                        </h2>
                        <img
                            className="w-24 h-24 mx-auto mb-4 rounded-full"
                            src={userData.photoURL || "defaultAvatarUrlHere"}
                            alt="Avatar de l'utilisateur"
                        />
                        <p className="text-gray-800 dark:text-gray-400">
                            <span className="font-semibold">Nom:</span> {userData.displayName}
                        </p>
                        <p className="text-gray-800 dark:text-gray-400">
                            <span className="font-semibold">Email:</span> {userData.email}
                        </p>
                        {/* Ajoutez d'autres champs en fonction de ce que vous avez dans userData */}
                    </>
                ) : (
                    <p className="text-center dark:text-gray-400">Chargement des données de l'utilisateur...</p>
                )}
            </div>
        </div>
    );
};

export default User;
