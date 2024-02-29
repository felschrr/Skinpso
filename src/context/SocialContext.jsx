// SocialContext.js
import React, { createContext, useContext, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const SocialContext = createContext({
    addContact: (contactDetails) => {},
    removeContact: (contactId) => {},
});

const SocialProvider = ({ children }) => {
    const { user } = useAuth();

    const addContact = async (contactDetails) => {
        if (!user || !user.contacts) return;
        const userRef = doc(db, "users", user.uid);
        // Sélection des propriétés spécifiques à conserver
        const newContact = {
            displayName: contactDetails.displayName,
            uid: contactDetails.uid,
            photo: contactDetails.photoURL, // Remplacez 'photo' par la clé correcte, ex: 'photoURL'
            signInDate: contactDetails.signInDate, // Assurez-vous que 'signInDate' est correct
        };

        // Mise à jour des contacts en ajoutant un nouveau contact
        await updateDoc(userRef, {
            // Utilisez une opération de tableau appropriée pour Firestore
            contacts: [...(user.contacts || []), newContact],
        });
        toast.success("You are now following " + newContact.displayName + "!");
    };

    const removeContact = async (contactId) => {
        if (!user) return;
        const userRef = doc(db, "users", user.uid);
        // Mise à jour des contacts en supprimant le contact spécifié
        await updateDoc(userRef, {
            contacts: user.contacts.filter(
                (contact, index) => index !== contactId
            ),
        });
    };

    const value = {
        addContact,
        removeContact,
    };

    return (
        <SocialContext.Provider value={value}>
            {children}
        </SocialContext.Provider>
    );
};

const useSocial = () => useContext(SocialContext);

export { SocialContext, SocialProvider, useSocial };
