import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  useColorScheme, // Импортируем useColorScheme
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { unitsByCategory } from "@/assets/unitData"; // Импорт данных
import styles from "../assets/styles";
import { Colors } from "@/constants/Colors";
import { formatNumber, formatExponential } from "@/assets/formatting";

type UnitCategory =
  | "Length"
  | "Weight"
  | "Temperature"
  | "Area"
  | "Volume"
  | "Time"
  | "DataVolume"
  | "Currency";

const categoryTitles = {
  Length: "Длина",
  Weight: "Вес",
  Temperature: "Температура",
  Area: "Площадь",
  Volume: "Объём",
  Time: "Время",
  DataVolume: "Объём данных",
  Currency: "Валюта",
};

export default function ConvertScreen() {
  const { category } = useLocalSearchParams<{ category: UnitCategory }>();
  const [inputValue1, setInputValue1] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  const [selectedUnit1, setSelectedUnit1] = useState(
    unitsByCategory[category][0]
  );
  const [selectedUnit2, setSelectedUnit2] = useState(
    unitsByCategory[category][1]
  );
  const router = useRouter(); // Используем роутер для перехода между экранами

  const colorScheme = useColorScheme();
  const currentColor = Colors[colorScheme ?? "light"]; // Получаем текущую тему (светлая или тёмная)

  // Хук useFocusEffect будет выполняться при каждом фокусе на экран
  useFocusEffect(
    React.useCallback(() => {
      // Сбрасываем значения полей при каждом возвращении на экран
      setInputValue1("");
      setInputValue2("");
      setSelectedUnit1(unitsByCategory[category][0]);
      setSelectedUnit2(unitsByCategory[category][1]);
    }, [category])
  );

  const handleSave = async () => {
    const currentTime = new Date().toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Moscow",
    });
    const currentDate = new Date().toLocaleDateString("ru-RU", {
      timeZone: "Europe/Moscow",
    });

    const originalValue = inputValue1;
    const resultValue = inputValue2;
    const conversion = `${selectedUnit1.abbreviation} в ${selectedUnit2.abbreviation}`;

    try {
      const storedHistory = await AsyncStorage.getItem("conversionHistory");
      const historyData = storedHistory ? JSON.parse(storedHistory) : [];

      const newHistoryItem = {
        id: Date.now().toString(),
        conversion,
        time: currentTime,
        date: currentDate,
        originalValue,
        resultValue,
      };

      const updatedHistory = [...historyData, newHistoryItem];
      await AsyncStorage.setItem(
        "conversionHistory",
        JSON.stringify(updatedHistory)
      );
      router.push("/history");
    } catch (error) {
      console.error("Ошибка при сохранении данных истории:", error);
    }
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [unitToChange, setUnitToChange] = useState<"first" | "second">("first");

  interface Unit {
    name: string;
    abbreviation: string;
    factor: number;
  }

  const formatInput = (value: string) => {
    let cleanedValue = value.replace(/[^0-9.]/g, "");
    const dotIndex = cleanedValue.indexOf(".");

    if (dotIndex !== -1) {
      cleanedValue =
        cleanedValue.slice(0, dotIndex + 1) +
        cleanedValue.slice(dotIndex + 1).replace(/\./g, "");
    }

    const numericValue = parseFloat(cleanedValue);
    if (!isNaN(numericValue)) {
      cleanedValue = numericValue
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    if (cleanedValue === "00") {
      cleanedValue = "0.0";
    }

    return cleanedValue;
  };

  const formatExponential = (value: number) => {
    return value.toExponential(5);
  };

  const handleUnitChange = (unit: Unit) => {
    if (
      unitToChange === "first" &&
      unit.abbreviation === selectedUnit2.abbreviation
    ) {
      alert("Выберите другую единицу измерения для первого поля.");
      return;
    } else if (
      unitToChange === "second" &&
      unit.abbreviation === selectedUnit1.abbreviation
    ) {
      alert("Выберите другую единицу измерения для второго поля.");
      return;
    }

    if (unitToChange === "first") {
      setSelectedUnit1(unit);
      setInputValue1("");
      setInputValue2("");
    } else {
      setSelectedUnit2(unit);
      setInputValue1("");
      setInputValue2("");
    }

    setIsModalVisible(false);
  };

  const updateInput2 = (value1: string, factor1: number, factor2: number) => {
    const numericValue =
      parseFloat(value1.replace(",", "").replace(/\./g, "")) || 0;

    const isCurrencyConversion = category === "Currency";

    const result = isCurrencyConversion
      ? numericValue * (factor2 / factor1)
      : numericValue * (factor1 / factor2);

    if (value1.trim() === "" || numericValue === 0) {
      setInputValue2("");
    } else {
      setInputValue2(
        result > 1e9 || result < 1e-9
          ? formatExponential(result)
          : formatNumber(result) // Используем новую функцию форматирования
      );
    }
  };
  const handleTextChange = (text: string) => {
    const cleanedValue = formatInput(text);
    if (cleanedValue === "") {
      setInputValue1("");
      setInputValue2("");
      return;
    }

    setInputValue1(cleanedValue);
    updateInput2(
      cleanedValue.replace(/ /g, ""),
      selectedUnit1.factor,
      selectedUnit2.factor
    );
  };

  const handleSwap = () => {
    const tempUnit = selectedUnit1;
    setSelectedUnit1(selectedUnit2);
    setSelectedUnit2(tempUnit);
    setInputValue1("");
    setInputValue2("");
  };

  const clearInput1 = () => {
    setInputValue1("");
    setInputValue2("");
  };

  const categoryTitle = categoryTitles[category];

  return (
    <View
      style={[styles.container, { backgroundColor: currentColor.background }]}
    >
      <Text style={[styles.headerText, { color: currentColor.text }]}>
        Конвертация {categoryTitle}
      </Text>

      <View
        style={[
          styles.inputContainer,
          { backgroundColor: currentColor.cardBackground },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: currentColor.cardBackground,
              color: currentColor.text,
            },
          ]}
          value={inputValue1}
          onChangeText={handleTextChange}
          keyboardType="numeric"
        />
        {inputValue1 && (
          <TouchableOpacity onPress={clearInput1}>
            <AntDesign name="close" size={24} color={currentColor.text} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.unitButton,
            { backgroundColor: currentColor.unitButton },
          ]}
          onPress={() => {
            setUnitToChange("first");
            setIsModalVisible(true);
          }}
        >
          <Text style={[styles.unitButtonText, { color: currentColor.text }]}>
            {selectedUnit1.abbreviation}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.swapIcon} onPress={handleSwap}>
        <AntDesign name="swap" size={45} color={currentColor.text} />
      </TouchableOpacity>

      <View
        style={[
          styles.inputContainer,
          { backgroundColor: currentColor.cardBackground },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: currentColor.cardBackground,
              color: currentColor.text,
            },
          ]}
          value={inputValue2}
          editable={false}
        />
        <TouchableOpacity
          style={[
            styles.unitButton,
            { backgroundColor: currentColor.unitButton },
          ]}
          onPress={() => {
            setUnitToChange("second");
            setIsModalVisible(true);
          }}
        >
          <Text style={[styles.unitButtonText, { color: currentColor.text }]}>
            {selectedUnit2.abbreviation}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: currentColor.cardBackground },
            ]}
          >
            <Text style={[styles.modalHeader, { color: currentColor.text }]}>
              Выберите единицу
            </Text>
            <FlatList
              data={unitsByCategory[category]}
              keyExtractor={(item) => item.abbreviation}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.unitOption}
                  onPress={() => handleUnitChange(item)}
                >
                  <Text style={[styles.unitName, { color: currentColor.text }]}>
                    {item.name} ({item.abbreviation})
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.saveButtonText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Сохранить конвертацию</Text>
      </TouchableOpacity>
    </View>
  );
}
