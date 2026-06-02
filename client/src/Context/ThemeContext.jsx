import { createContext, useContext, useEffect, useState } from "react";

//Context lets any component directly access the theme.
const ThemeContext = createContext();

//This function decides which theme should be loaded when the website starts.
const getInitialTheme = () => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
        return saved;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    //If user never visited before:saved = null , Then: checks system settings 
};


export const ThemeProvider = ({ children }) => {

    const [theme, setTheme] = useState(getInitialTheme);

    //Runs every time: theme changes.
    useEffect(() => {
        document.documentElement.classList.remove("light", "dark");//Remove Old Theme
        document.documentElement.classList.add(theme);//Add New Theme
        localStorage.setItem("theme", theme);//Stores theme permanently.
    }, [theme]);

    //This function switches theme
    const toggleTheme = () => {
        setTheme((currentTheme) => currentTheme === "light" ? "dark" : "light");
    };

    return (
        //Provide Data to Entire App
        //Any component can use theme and toggleTheme 
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);
