import { useState } from "react";

const DarkMode = () => {
    const [isDarkMode, setDarkMode] = useState(true);

    const handleClick = () => {
        const htmlElement = document.getElementById("html");
        if (htmlElement) {
            htmlElement.classList.toggle("dark");
            setDarkMode(!isDarkMode);
        }
    };

    return (
        <button
            onClick={handleClick}
            type="button"
            className={`text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2 text-center ${
                isDarkMode ? "dark:bg-yellow-500" : "dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            }`}
        >
            {isDarkMode ? "☀️" : "🌙"} 
        </button>
    );
};

export default DarkMode;
