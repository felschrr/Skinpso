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
import { toast } from "react-toastify";
import weapons from "../../public/data/weapons";

// Création du contexte d'authentification
const AuthContext = createContext({
  signInWithGoogle: async () => {},
  logout: async () => {},
  user: null,
  currency: "CNY", // Devise par défaut
  setCurrency: () => {},
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("CNY"); // Devise par défaut

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
            currency: "CNY", // Définir la devise par défaut
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
            currency: "CNY", // Définir la devise par défaut
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
      toast.success("Connexion réussie!");
    } catch (error) {
      console.error("Erreur lors de la connexion avec Google :", error);
      toast.error("Erreur lors de la connexion avec Google : ", error);
    }
  };

  // Fonction pour se déconnecter avec confirmation
  const logout = async () => {
    Swal.fire({
      title: "Confirmation",
      text: "Voulez-vous vraiment vous déconnecter ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Oui",
      cancelButtonText: "Non",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await signOut(auth); // Si l'utilisateur confirme, procédez à la déconnexion
        toast.success("Déconnexion réussie!");
      }
    });
  };

  const value = {
    signInWithGoogle,
    logout,
    user,
    setUser,
    currency,
    setCurrency,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          {/* SVG ou animation de chargement */}
          <svg
            className="animate-spin -ml-1 mr-3 h-10 w-10 text-slate-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {/* Texte optionnel */}
          <div className="text-lg text-slate-500">
            Chargement des données...
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthContext, AuthProvider, useAuth };
