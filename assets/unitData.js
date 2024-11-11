import axios from "axios";

const API_URL = "https://openexchangerates.org/api/latest.json";
const APP_ID = "50b49977f9cb43c6885a46a9d46e93e4";

export const unitsByCategory = {
  Length: [
    { name: "метры", abbreviation: "м", factor: 1 },
    { name: "сантиметры", abbreviation: "см", factor: 0.01 },
    { name: "миллиметры", abbreviation: "мм", factor: 0.001 },
    { name: "километры", abbreviation: "км", factor: 1000 },
    { name: "дюймы", abbreviation: "дюйм", factor: 0.0254 },
    { name: "футы", abbreviation: "фт", factor: 0.3048 },
    { name: "ярды", abbreviation: "ярд", factor: 0.9144 },
    { name: "мили", abbreviation: "миля", factor: 1609.34 },
  ],
  Weight: [
    { name: "килограммы", abbreviation: "кг", factor: 1 },
    { name: "граммы", abbreviation: "г", factor: 0.001 },
    { name: "миллиграммы", abbreviation: "мг", factor: 0.000001 },
    { name: "фунты", abbreviation: "фунт", factor: 0.453592 },
    { name: "унции", abbreviation: "унция", factor: 0.0283495 },
    { name: "Стоун", abbreviation: "ст", factor: 6.35029 },
  ],
  Temperature: [
    { name: "Цельсий", abbreviation: "°C", factor: 1 },
    { name: "Фаренгейт", abbreviation: "°F", factor: 0.5556 },
    { name: "Кельвин", abbreviation: "K", factor: 1 },
  ],
  Area: [
    { name: "квадратные метры", abbreviation: "м²", factor: 1 },
    { name: "квадратные сантиметры", abbreviation: "см²", factor: 0.0001 },
    { name: "квадратные километры", abbreviation: "км²", factor: 1000000 },
    { name: "акры", abbreviation: "акр", factor: 4046.86 },
    { name: "гектары", abbreviation: "га", factor: 10000 },
    { name: "квадратные футы", abbreviation: "фт²", factor: 0.092903 },
    { name: "квадратные дюймы", abbreviation: "дюйм²", factor: 0.00064516 },
    { name: "квадратные мили", abbreviation: "миля²", factor: 2589988.11 },
  ],
  Volume: [
    { name: "литры", abbreviation: "л", factor: 1 },
    { name: "миллилитры", abbreviation: "мл", factor: 0.001 },
    { name: "кубические метры", abbreviation: "м³", factor: 1000 },
    { name: "кубические сантиметры", abbreviation: "см³", factor: 0.001 },
    { name: "галлоны", abbreviation: "гал", factor: 3.78541 },
    { name: "кварты", abbreviation: "кв", factor: 0.946353 },
    { name: "пинты", abbreviation: "пт", factor: 0.473176 },
    { name: "чашки", abbreviation: "чаша", factor: 0.24 },
    { name: "жидкие унции", abbreviation: "ж унция", factor: 0.0295735 },
  ],
  Time: [
    { name: "секунды", abbreviation: "с", factor: 1 },
    { name: "минуты", abbreviation: "мин", factor: 60 },
    { name: "часы", abbreviation: "ч", factor: 3600 },
    { name: "дни", abbreviation: "д", factor: 86400 },
    { name: "недели", abbreviation: "нед", factor: 604800 },
    { name: "месяцы", abbreviation: "мес", factor: 2629800 },
    { name: "годы", abbreviation: "г", factor: 31557600 },
  ],
  DataVolume: [
    { name: "байты", abbreviation: "Б", factor: 1 },
    { name: "килобайты", abbreviation: "КБ", factor: 1024 },
    { name: "мегабайты", abbreviation: "МБ", factor: 1048576 },
    { name: "гигабайты", abbreviation: "ГБ", factor: 1073741824 },
    { name: "терабайты", abbreviation: "ТБ", factor: 1099511627776 },
    { name: "петабайты", abbreviation: "ПБ", factor: 1125899906842624 },
  ],
  Currency: [{ name: "Доллар США", abbreviation: "USD", factor: 1 }],
};

export async function fetchAndUpdateCurrencyRates() {
  try {
    const response = await axios.get(`${API_URL}?app_id=${APP_ID}`);
    const rates = response.data.rates;

    // Устанавливаем доллар как базовую валюту
    unitsByCategory.Currency = [
      { name: "Доллар США", abbreviation: "USD", factor: 1 }, // 1 USD
      { name: "Евро", abbreviation: "EUR", factor: rates.EUR }, // Прямой курс
      { name: "Британский фунт", abbreviation: "GBP", factor: rates.GBP },
      { name: "Японская иена", abbreviation: "JPY", factor: rates.JPY },
      { name: "Канадский доллар", abbreviation: "CAD", factor: rates.CAD },
      { name: "Австралийский доллар", abbreviation: "AUD", factor: rates.AUD },
      { name: "Швейцарский франк", abbreviation: "CHF", factor: rates.CHF },
      { name: "Китайский юань", abbreviation: "CNY", factor: rates.CNY },
      { name: "Российский рубль", abbreviation: "RUB", factor: rates.RUB },
      { name: "Индийская рупия", abbreviation: "INR", factor: rates.INR },
      { name: "Бразильский реал", abbreviation: "BRL", factor: rates.BRL },
      { name: "Сингапурский доллар", abbreviation: "SGD", factor: rates.SGD },
      { name: "Мексиканский песо", abbreviation: "MXN", factor: rates.MXN },
      { name: "Южнокорейская вона", abbreviation: "KRW", factor: rates.KRW },
      { name: "Турецкая лира", abbreviation: "TRY", factor: rates.TRY },
      { name: "Шведская крона", abbreviation: "SEK", factor: rates.SEK },
      { name: "Норвежская крона", abbreviation: "NOK", factor: rates.NOK },
      { name: "Южноафриканский ранд", abbreviation: "ZAR", factor: rates.ZAR },
    ];

    console.log(
      "Currency rates updated successfully:",
      unitsByCategory.Currency
    );
  } catch (error) {
    console.error("Error fetching currency data:", error);
  }
}

const convertCurrency = (value, fromCurrency, toCurrency) => {
  const fromRate =
    unitsByCategory.Currency.find((c) => c.abbreviation === fromCurrency)
      ?.factor || 1;
  const toRate =
    unitsByCategory.Currency.find((c) => c.abbreviation === toCurrency)
      ?.factor || 1;

  // Теперь правильно рассчитываем курс
  const convertedValue = (value * (fromRate / toRate)).toFixed(2);
  return convertedValue;
};

const valueInUSD = convertCurrency(1, "RUB", "USD");
console.log(`1 RUB = ${valueInUSD} USD`); // Ожидается: 100 EUR = 108.70 USD, если 1 EUR = 1.0870 USD

// Пример использования функции для обновления курсов валют
fetchAndUpdateCurrencyRates();
