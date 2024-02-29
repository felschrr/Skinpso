// SocialContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const SocialContext = createContext({
    contacts: [],
    setContacts: () => {},
    addContact: (contactDetails) => {},
    removeContact: (contactId) => {},
});

const SocialProvider = ({ children }) => {
    const { user } = useAuth();
    const [contacts, setContacts] = useState([]); // Stocke les contacts dans l'état local

    // Implémentation de getContacts
    const getContacts = async () => {
        if (!user) return; // S'assurer qu'un utilisateur est connecté

        try {
            const userDocRef = doc(db, "users", user.uid); // Référence au document de l'utilisateur
            const docSnap = await getDoc(userDocRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                // Vérifie si userData.contacts existe et met à jour l'état, sinon initialise avec un tableau vide
                setContacts(userData.contacts || []);
            } else {
                console.log("No such document!");
                setContacts([]); // Assurez-vous de réinitialiser les contacts si l'utilisateur n'existe pas
            }
        } catch (error) {
            console.error("Failed to fetch user contacts", error);
            toast.error("Failed to fetch contacts: " + error.message);
        }
    };

    // Assurez-vous de déclencher getContacts lorsque l'utilisateur change ou au montage du composant
    useEffect(() => {
        getContacts();
    }, [contacts]);

    const addContact = async (contactDetails) => {
        if (!user || !user.contacts) return;
        try{
            const userRef = doc(db, "users", user.uid);
            // Sélection des propriétés spécifiques à conserver
            const newContact = {
                displayName: contactDetails.displayName,
                uid: contactDetails.uid,
                photoURL: contactDetails.photoURL, // Remplacez 'photo' par la clé correcte, ex: 'photoURL'
                signInDate: contactDetails.signInDate, // Assurez-vous que 'signInDate' est correct
            };
    
            // Mise à jour des contacts en ajoutant un nouveau contact
            await updateDoc(userRef, {
                // Utilisez une opération de tableau appropriée pour Firestore
                contacts: [...(user.contacts || []), newContact],
            });
            toast.success("You are now following " + newContact.displayName + "!");
        } catch(error){
            toast.error("Failed to follow " + newContact.displayName + ", see Console for more");
            console.error(error)
        }
    };

    const removeContact = async (contactToRemove) => {
        if (!user) return;
        try {
            const userRef = doc(db, "users", user.uid);
            // Mise à jour des contacts en supprimant le contact spécifié
            await updateDoc(userRef, {
                contacts: user.contacts.filter(
                    (contact) => contact.uid !== contactToRemove.uid
                ),
            });
            toast.success("You are no longer following " + contactToRemove.displayName + "!");
        } catch(error) {
            toast.error("Failed to remove " + contactToRemove.displayName + ", see Console for more");
            console.error(error);
        }
    };
    

    const value = {
        contacts,
        setContacts,
        addContact,
        removeContact,
        getContacts,
    };

    return (
        <SocialContext.Provider value={value}>
            {children}
        </SocialContext.Provider>
    );
};

const useSocial = () => useContext(SocialContext);

export { SocialContext, SocialProvider, useSocial };
