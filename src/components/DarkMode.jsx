import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { toast } from "react-toastify";

const DarkMode = () => {
  const [isDarkMode, setDarkMode] = useState(true);

  const handleClick = () => {
    const htmlElement = document.getElementById("html");
    if (htmlElement) {
      htmlElement.classList.toggle("dark");
      setDarkMode(!isDarkMode);
    }
    toast.success("Le thème a bien été mis à jour!");
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className={"text-white font-medium rounded-lg text-sm px-4 py-2 text-center bg-slate-800 dark:bg-white dark:border-2"}
    >
      {isDarkMode ? (
          <Moon className=" h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 fill-slate-800" />
          ) : (
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 fill-white" />
      )}
    </button>
  );
};

export default DarkMode;
