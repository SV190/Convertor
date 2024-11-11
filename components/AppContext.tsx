// AppContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppContextProps {
  isDarkMode: boolean;
  selectedLanguage: string;
  toggleDarkMode: () => void;
  setLanguage: (lang: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  useEffect(() => {
    const loadSettings = async () => {
      const savedTheme = await AsyncStorage.getItem("isDarkMode");
      const savedLanguage = await AsyncStorage.getItem("selectedLanguage");
      if (savedTheme !== null) setIsDarkMode(JSON.parse(savedTheme));
      if (savedLanguage) setSelectedLanguage(savedLanguage);
    };

    loadSettings();
  }, []);

  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await AsyncStorage.setItem("isDarkMode", JSON.stringify(newMode));
  };

  const setLanguage = async (lang: string) => {
    setSelectedLanguage(lang);
    await AsyncStorage.setItem("selectedLanguage", lang);
  };

  return (
    <AppContext.Provider
      value={{ isDarkMode, selectedLanguage, toggleDarkMode, setLanguage }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
