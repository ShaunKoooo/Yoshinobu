
/**
 * 格式化日期為 YYYY-MM-DD
 * @param date 日期物件
 * @returns 格式化後的日期字串
 */
export const formatDate = (date: Date): string | number => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 取得日期的星期幾
 * @param dateStr 日期字串
 * @returns 星期幾的中文名稱
 */
export const getWeekday = (dateStr: string): string | null | number => {
  if (!dateStr) {
    return '';
  }
  const date = new Date(dateStr);
  const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
  return weekdays[date.getDay()];
}

/**
 * 格式化日期時間為 HH:MM
 * @param dateStr 日期字串
 * @returns 格式化時間字串
 */
export const formatTime = (timeStr: string): string | null | number => {
  if (!timeStr) {
    return '';
  }
  const date = new Date(timeStr);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};