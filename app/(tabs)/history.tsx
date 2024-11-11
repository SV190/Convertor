import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
} from "react-native";
import { useLocalSearchParams, Link } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors"; // Импортируйте ваши цвета

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ConversionHistory {
  id: string;
  conversion: string;
  time: string;
  date: string;
  originalValue: string;
  resultValue: string;
}

export default function HistoryScreen() {
  const { newConversion, time, date, originalValue, resultValue } =
    useLocalSearchParams();

  const [historyData, setHistoryData] = useState<ConversionHistory[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const colorScheme = useColorScheme(); // Получаем текущую тему
  const currentColor = Colors[colorScheme ?? "light"]; // Устанавливаем цвета в зависимости от темы

  useEffect(() => {
    const loadHistoryData = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem("conversionHistory");
        if (storedHistory) {
          const parsedHistory = JSON.parse(storedHistory);
          console.log("Загруженная история:", parsedHistory);
          setHistoryData(parsedHistory);
        }
      } catch (error) {
        console.error("Ошибка загрузки данных истории:", error);
      }
    };

    loadHistoryData();
  }, []);

  const logAllData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const values = await AsyncStorage.multiGet(keys);
      values.forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
      });
    } catch (error) {
      console.error("Ошибка загрузки данных из AsyncStorage:", error);
    }
  };

  useEffect(() => {
    logAllData();
  }, []);

  useEffect(() => {
    const addNewConversion = async () => {
      if (newConversion && time && date && originalValue && resultValue) {
        const newHistoryItem = {
          id: Date.now().toString(),
          conversion: Array.isArray(newConversion)
            ? newConversion[0]
            : newConversion,
          time: Array.isArray(time) ? time[0] : time,
          date: Array.isArray(date) ? date[0] : date,
          originalValue: Array.isArray(originalValue)
            ? originalValue[0]
            : originalValue,
          resultValue: Array.isArray(resultValue)
            ? resultValue[0]
            : resultValue,
        };

        const storedHistory = await AsyncStorage.getItem("conversionHistory");
        const currentHistory = storedHistory ? JSON.parse(storedHistory) : [];
        const updatedHistory = [...currentHistory, newHistoryItem];
        await AsyncStorage.setItem(
          "conversionHistory",
          JSON.stringify(updatedHistory)
        );
        setHistoryData(updatedHistory);
      }
    };

    addNewConversion();
  }, [newConversion, time, date, originalValue, resultValue]);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(id === expandedId ? null : id);
  };

  const deleteHistoryItem = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setHistoryData((prev) => {
      const updatedHistory = prev.filter((item) => item.id !== id);
      AsyncStorage.setItem("conversionHistory", JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem("conversionHistory");
      setHistoryData([]);
    } catch (error) {
      console.error("Ошибка очистки данных истории:", error);
    }
  };

  const renderRightActions = (id: string) => {
    return (
      <TouchableOpacity
        onPress={() => deleteHistoryItem(id)}
        style={styles.deleteButton}
      >
        <Animated.Text style={styles.deleteButtonText}>Удалить</Animated.Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }: { item: ConversionHistory }) => {
    const isExpanded = item.id === expandedId;
    return (
      <Swipeable renderRightActions={() => renderRightActions(item.id)}>
        <TouchableOpacity
          style={[
            styles.historyItem,
            { backgroundColor: currentColor.cardBackground },
          ]}
          onPress={() => toggleExpand(item.id)}
        >
          <View style={styles.row}>
            <MaterialCommunityIcons
              name="arrow-right-circle-outline"
              size={24}
              color={currentColor.text}
            />
            <View style={styles.historyDetails}>
              <Text
                style={[styles.conversionText, { color: currentColor.text }]}
              >
                {item.conversion}
              </Text>
              <Text style={[styles.timeText, { color: "#0066FF" }]}>
                {item.time}
              </Text>
            </View>
          </View>

          {isExpanded && (
            <View style={styles.expandedContent}>
              <Text style={[styles.expandedText, { color: currentColor.text }]}>
                Подробности: {item.conversion}
              </Text>
              <Text style={[styles.expandedText, { color: currentColor.text }]}>
                Исходное значение: {item.originalValue}
              </Text>
              <Text style={[styles.expandedText, { color: currentColor.text }]}>
                Конечное значение: {item.resultValue}
              </Text>
              <Text style={[styles.expandedText, { color: currentColor.text }]}>
                Дата: {item.date}, Время: {item.time}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <GestureHandlerRootView
      style={[styles.container, { backgroundColor: currentColor.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: currentColor.text }]}>
          История конвертаций
        </Text>
        {/* <Link href="/settingsScreen" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <MaterialCommunityIcons
              name="cog-outline"
              size={24}
              color={currentColor.text}
            />
          </TouchableOpacity>
        </Link> */}
      </View>

      <FlatList
        data={historyData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.historyList}
      />

      <TouchableOpacity
        style={[
          styles.clearButton,
          { backgroundColor: currentColor.cardBackground },
        ]}
        onPress={clearHistory}
      >
        <Text style={[styles.clearButtonText, { color: currentColor.text }]}>
          Очистить историю
        </Text>
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  menuItem: {},
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  historyDetails: {
    marginLeft: 10,
  },
  conversionText: {
    fontSize: 18,
  },
  timeText: {
    fontSize: 14,
    color: "#0066FF",
  },
  expandedContent: {
    marginTop: 10,
    padding: 15,
    borderRadius: 5,
  },
  expandedText: {
    fontSize: 14,
  },
  clearButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  clearButtonText: {
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: "#B81413",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    width: 80,
    height: "88%",
    marginLeft: 10,
  },
  deleteButtonText: {
    color: "#FFFFFF",
  },
});
