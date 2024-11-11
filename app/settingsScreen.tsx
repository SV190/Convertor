// SettingsScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Colors } from "@/constants/Colors"; // Убедитесь, что путь правильный
import { useAppContext } from "@/components/AppContext"; // Импортируем контекст

const SettingsScreen = () => {
  const { isDarkMode, toggleDarkMode, selectedLanguage, setLanguage } =
    useAppContext();
  const colorScheme = useColorScheme();
  const currentColor =
    Colors[isDarkMode || colorScheme === "dark" ? "dark" : "light"];

  return (
    <View
      style={[styles.container, { backgroundColor: currentColor.background }]}
    >
      <Text style={[styles.title, { color: currentColor.text }]}>
        Настройки
      </Text>

      <Text style={[styles.settingText, { color: currentColor.text }]}>
        Тема
      </Text>
      <View style={styles.themeOptions}>
        <TouchableOpacity onPress={() => toggleDarkMode()}>
          <Text style={[styles.themeOption]}>
            {isDarkMode ? "Светлая тема" : "Темная тема"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleDarkMode()}>
          <Text style={[styles.themeOption]}>Автоматическая тема</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.settingText, { color: currentColor.text }]}>
        Язык
      </Text>
      <View style={styles.settingItem}>
        <TouchableOpacity onPress={() => setLanguage("en")}>
          <Text
            style={[
              styles.languageText,
              selectedLanguage === "en" && styles.selectedLanguage,
              { color: currentColor.text },
            ]}
          >
            Английский
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setLanguage("ru")}>
          <Text
            style={[
              styles.languageText,
              selectedLanguage === "ru" && styles.selectedLanguage,
              { color: currentColor.text },
            ]}
          >
            Русский
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  settingText: {
    fontSize: 18,
  },
  themeOptions: {
    marginVertical: 10,
  },
  themeOption: {
    fontSize: 18,
    paddingVertical: 10,
  },
  selectedTheme: {
    fontWeight: "bold",
    color: "#007AFF", // Цвет для выделенной темы (можно изменить на нужный)
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  languageText: {
    fontSize: 18,
    marginVertical: 10,
  },
  selectedLanguage: {
    fontWeight: "bold",
  },
});

export default SettingsScreen;
