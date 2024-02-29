import React, { createContext, useState, useEffect, useContext } from "react";
import { useUser } from "./UserContext";

// Création du contexte de thème
const ThemeContext = createContext("light");

export const ThemeProvider = ({ children }) => {
    const { theme } = useUser();
    const [activeTheme, setActiveTheme] = useState("light");
    useEffect(() => {
        // Fonction pour mettre à jour le thème
        const updateTheme = () => {
            const systemTheme = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches
                ? "dark"
                : "light";
            const newActiveTheme = theme === "default" ? systemTheme : theme;
            setActiveTheme(newActiveTheme);

            // Applique ou retire la classe 'dark' sur la balise HTML
            if (newActiveTheme === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        };

        // Initialiser le thème
        updateTheme();

        // Écouter les changements de préférence du thème système
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        mediaQuery.addListener(updateTheme); // Ajout de l'écouteur pour les changements

        return () => {
            // Nettoyage en retirant l'écouteur lorsque le composant est démonté ou le thème change
            mediaQuery.removeListener(updateTheme);
        };
    }, [theme]);

    return (
        <ThemeContext.Provider value={activeTheme}>
            {children}
        </ThemeContext.Provider>
    );
};

// Hook personnalisé pour utiliser le thème
export const useTheme = () => useContext(ThemeContext);
