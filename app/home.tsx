import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";

type MenuItemProps = {
  href: { pathname: string; params: { category: string } };
  iconComponent: React.ComponentType<{
    name: string;
    size: number;
    color: string;
  }>;
  iconName: string;
  title: string;
  colorScheme: string;
  currentColor: any; // Определите более конкретный тип для currentColor, если возможно.
};

const MenuItem: React.FC<MenuItemProps> = ({
  href,
  iconComponent: IconComponent,
  iconName,
  title,
  colorScheme,
  currentColor,
}) => {
  return (
    <Link href={href} asChild>
      <TouchableOpacity
        style={{
          backgroundColor: currentColor.cardBackground,
          flexDirection: "row",
          alignItems: "center",
          padding: 15,
          marginBottom: 10,
          borderRadius: 10,
        }}
      >
        <IconComponent name={iconName} size={24} color={currentColor.text} />
        <Text style={[styles.menuText, { color: currentColor.text }]}>
          {title}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const currentColor = Colors[colorScheme ?? "light"];

  const menuItems = [
    {
      href: { pathname: "/convert", params: { category: "Length" } },
      iconComponent: MaterialCommunityIcons,
      iconName: "ruler",
      title: "Длина",
      colorScheme: colorScheme,
    },
    {
      href: { pathname: "/convert", params: { category: "Weight" } },
      iconComponent: MaterialCommunityIcons,
      iconName: "weight",
      title: "Вес",
      colorScheme: colorScheme,
    },
    {
      href: { pathname: "/convert", params: { category: "Temperature" } },
      iconComponent: FontAwesome,
      iconName: "thermometer-2",
      title: "Температура",
      colorScheme: colorScheme,
    },
    {
      href: { pathname: "/convert", params: { category: "Area" } },
      iconComponent: MaterialCommunityIcons,
      iconName: "square-outline",
      title: "Площадь",
      colorScheme: colorScheme,
    },
    {
      href: { pathname: "/convert", params: { category: "Volume" } },
      iconComponent: MaterialCommunityIcons,
      iconName: "flask-outline",
      title: "Объём",
      colorScheme: colorScheme,
    },
    {
      href: { pathname: "/convert", params: { category: "Time" } },
      iconComponent: MaterialIcons,
      iconName: "access-time",
      title: "Время",
      colorScheme: colorScheme,
    },
    {
      href: { pathname: "/convert", params: { category: "DataVolume" } },
      iconComponent: Feather,
      iconName: "database",
      title: "Объём данных",
      colorScheme: colorScheme,
    },
    {
      href: { pathname: "/convert", params: { category: "Currency" } },
      iconComponent: FontAwesome,
      iconName: "dollar",
      title: "Валюта",
      colorScheme: colorScheme,
    },
  ];

  return (
    <View
      style={[styles.container, { backgroundColor: currentColor.background }]}
    >
      <Text style={[styles.title, { color: currentColor.text }]}>
        Добро пожаловать в приложение!
      </Text>

      <View style={[styles.menu, { backgroundColor: currentColor.background }]}>
        {/* Генерация меню на основе массива данных */}
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            href={item.href}
            iconComponent={item.iconComponent}
            iconName={item.iconName}
            title={item.title}
            currentColor={currentColor}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F9FF",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  menu: {
    marginBottom: 50,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  menuText: {
    fontSize: 18,
    marginLeft: 10,
  },
});
