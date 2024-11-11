// formatting.ts

/**
 * Форматирует число с добавлением пробелов для разделения тысяч и округлением до трех знаков после запятой.
 * @param value Число для форматирования.
 * @returns Строка с отформатированным числом.
 */
export const formatNumber = (value: number): string => {
  if (isNaN(value)) return "0.000";

  // Округляем до трех знаков после запятой
  const roundedValue = Math.round(value * 1000) / 1000;

  // Форматируем с пробелами для разделения тысяч
  return roundedValue
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    .replace(".", ",");
};

/**
 * Форматирует число в экспоненциальном виде с 5 знаками после запятой.
 * @param value Число для форматирования.
 * @returns Строка с отформатированным числом в экспоненциальной форме.
 */
export const formatExponential = (value: number): string => {
  return value.toExponential(5);
};
