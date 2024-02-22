import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../config/firebase";
import {
  signInWithPopup,
  onAuthStateChanged,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import Swal from "sweetalert2";

// Création du contexte d'authentification
const AuthContext = createContext({
  signInWithGoogle: async () => {},
  logout: async () => {},
  user: null,
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const weapons = [
    { name: "AK-47", skins: [] },
    { name: "AUG", skins: [] },
    { name: "AWP", skins: [] },
    { name: "CZ75-Auto", skins: [] },
    { name: "Desert Eagle", skins: [] },
    { name: "Dual Berettas", skins: [] },
    { name: "FAMAS", skins: [] },
    { name: "Five-Seven", skins: [] },
    { name: "G3SG1", skins: [] },
    { name: "Galil-AR", skins: [] },
    { name: "Glock-18", skins: [] },
    { name: "M249", skins: [] },
    { name: "M4A1-S", skins: [] },
    { name: "M4A4", skins: [] },
    { name: "MAC10", skins: [] },
    { name: "MAG-7", skins: [] },
    { name: "MP5-SD", skins: [] },
    { name: "MP7", skins: [] },
    { name: "MP9", skins: [] },
    { name: "Negev", skins: [] },
    { name: "Nova", skins: [] },
    { name: "P2000", skins: [] },
    { name: "P250", skins: [] },
    { name: "P90", skins: [] },
    { name: "PP-Bizon", skins: [] },
    { name: "R8 Revolver", skins: [] },
    { name: "SCAR-20", skins: [] },
    { name: "SG 553", skins: [] },
    { name: "SSG 08", skins: [] },
    { name: "Sawed Off", skins: [] },
    { name: "Tec9", skins: [] },
    { name: "UMP-45", skins: [] },
    { name: "USP-S", skins: [] },
    { name: "XM1014", skins: [] },
  ];

  // Modification du useEffect pour récupérer les données de Firestore et les combiner
  // avec les données d'authentification afin de pouvoir ajouter et supprimer des contacts.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Récupération des données de l'utilisateur dans Firestore
        const userRef = doc(db, "users", firebaseUser.uid);
        const inventoryRef = doc(db, "inventories", firebaseUser.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          // Combiner les données d'authentification avec les données de Firestore
          setUser({
            ...firebaseUser, // Données de l'authentification Firebase
            ...docSnap.data(), // Données supplémentaires de Firestore
          });
        } else {
          // Si l'utilisateur n'a pas de document dans Firestore, initialisez-le
          await setDoc(userRef, {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName.toLowerCase() || "",
            email: firebaseUser.email || "",
            photoURL: firebaseUser.photoURL || "",
            signInDate: firebaseUser.metadata.creationTime || "",
          });
          // Si l'utilisateur n'a pas de document inventaire dans Firestore, initialisez-le
          await setDoc(inventoryRef, {
            weapons: weapons,
          });

          setUser({
            ...firebaseUser,
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName.toLowerCase() || "",
            email: firebaseUser.email || "",
            photoURL: firebaseUser.photoURL || "",
            signInDate: firebaseUser.metadata.creationTime || "",
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fonction pour se connecter via Google
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Erreur lors de la connexion avec Google :", error);
    }
  };

// Fonction pour se déconnecter avec confirmation
const logout = async () => {
  Swal.fire({
    title: 'Confirmation',
    text: 'Voulez-vous vraiment vous déconnecter ?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui',
    cancelButtonText: 'Non',
  }).then(async (result) => {
    if (result.isConfirmed) {
      await signOut(auth); // Si l'utilisateur confirme, procédez à la déconnexion
      Swal.fire({
        title: 'Déconnexion réussie',
        text: 'Vous avez été déconnecté avec succès.',
        icon: 'success',
      });
    }
  });
};


  const value = {
    signInWithGoogle,
    logout,
    user,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>User data loading...</div> : children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthContext, AuthProvider, useAuth };
