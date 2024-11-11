import React from "react";
import { AppProvider } from "@/components/AppContext"; // Убедитесь, что путь правильный
import AppNavigator from "@/app/AppNavigator"; // Ваш основной компонент приложения

const App = () => {
  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
};

export default App;
