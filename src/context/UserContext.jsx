import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { AuthContext } from "./AuthContext";

const UserContext = createContext({
    currency: "CNY",
    theme: "default",
    visibility: true, // Correction : le boolean true ne doit pas être une chaîne de caractères "true"
    setCurrency: () => {},
    setTheme: () => {},
});

export const UserProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [currency, setCurrency] = useState("CNY");
    const [theme, setTheme] = useState("default");
    const [visibility, setVisibility] = useState(true); // Correction : initialisation avec un boolean

    useEffect(() => {
        if (user) {
            const fetchUserData = async () => {
                const userRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setCurrency(userData.currency);
                    setTheme(userData.theme || "default");
                    setVisibility(
                        userData.visibility === undefined
                            ? true
                            : userData.visibility
                    ); // Correction : récupération de la visibilité depuis les données utilisateur
                } else {
                    await setDoc(userRef, {
                        uid: user.uid,
                        currency: "CNY",
                        theme: "default",
                        visibility: true, // Correction : initialisation de la visibilité avec un boolean
                    });
                    setCurrency("CNY");
                    setTheme("default");
                    setVisibility(true); // Correction : initialisation de la visibilité avec un boolean
                }
            };
            fetchUserData();
        }
    }, [user]);

    const updateTheme = async (newTheme) => {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
            theme: newTheme,
        });
        setTheme(newTheme);
    };

    const updateCurrency = async (newCurrency) => {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
            currency: newCurrency,
        });
        setCurrency(newCurrency);
    };

    const updateVisibility = async () => {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
            visibility: !visibility,
        });
        setVisibility(!visibility); // Correction : inversion de la visibilité actuelle
    };

    const value = {
        currency,
        theme,
        visibility,
        setVisibility: updateVisibility, // Correction : utilisation de la fonction d'updateVisibility
        setCurrency: updateCurrency,
        setTheme: updateTheme,
    };

    return (
        <UserContext.Provider value={value}>{children}</UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
