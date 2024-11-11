import React from "react";
import { NavigationContainer } from "@react-navigation/native"; // Убедитесь, что этот импорт здесь
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ConvertScreen from "@/app/convert"; // Путь к экрану конвертации
import HistoryScreen from "@/app/(tabs)/history"; // Путь к экрану истории
import HomeScreen from "@/app/home"; // Путь к экрану главной страницы
import SettingsScreen from "@/app/settingsScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer independent={true}>
      {/* Этот контейнер должен быть только здесь */}
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // Если вы не хотите отображать заголовок
          gestureEnabled: true, // Включает жесты для навигации
          gestureDirection: "horizontal", // Направление жестов
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Convert" component={ConvertScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
