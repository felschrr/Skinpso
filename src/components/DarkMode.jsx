import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const DarkMode = () => {
  const { user, darkMode, setDarkMode } = useAuth();

  useEffect(() => {
    // Récupérer la valeur de darkMode depuis localStorage
    const savedDarkMode = localStorage.getItem("darkMode");
    // Si la valeur existe et est true, ajouter la classe dark à l'élément html
    if (savedDarkMode && JSON.parse(savedDarkMode)) {
      document.documentElement.classList.add("dark");
    } else {
      // Sinon, supprimer la classe dark de l'élément html
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleClick = () => {
    const htmlElement = document.getElementById("html");
    if (htmlElement) {
      htmlElement.classList.toggle("dark");
      setDarkMode(user.uid, !darkMode);
    }
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className={`text-white font-medium rounded-lg text-sm px-4 py-2 text-center bg-slate-800 dark:bg-white dark:border-2 ${
        darkMode ? "dark" : ""
      }`}
    >
      {darkMode ? (
        <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 fill-slate-800" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 fill-slate-800" />
      )}
    </button>
  );
};

export default DarkMode;
