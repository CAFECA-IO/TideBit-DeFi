import {
  PIE_CHART_EMPTY_COLOR_PROPERTY,
  PIE_CHART_FILL_COLORS_PROPERTIES,
} from '@/constants/display';

// Info: (20251230 - Julian) 取得 CSS 變數顏色
export function getCssVariable(variableName: string): string {
  const computedStyle = getComputedStyle(document.documentElement);
  const property = computedStyle.getPropertyValue(variableName);
  const value = property || variableName;

  return value.trim();
}

// Info: (20260116 - Julian) 由於 Tailwind CSS 無法直接使用變數作為 class 名稱，所以需要透過函式映射
export function getBgColor(token: string) {
  switch (token) {
    case '#9b8afb':
      return 'bg-[#9b8afb]';
    case '#fd6f8e':
      return 'bg-[#fd6f8e]';
    case '#ff883e':
      return 'bg-[#ff883e]';
    case '#6cdea0':
      return 'bg-[#6cdea0]';
    case '#8098f9':
      return 'bg-[#8098f9]';
    case '#f670c7':
      return 'bg-[#f670c7]';
    case '#53b1fd':
      return 'bg-[#53b1fd]';
    default:
      return '';
  }
}

// Info: (20260116 - Julian) 根據圓餅圖的標籤和索引取得填充顏色
export function getPieChartFillColor(label: string, index: number): string {
  if (label === 'empty') {
    // Info: (20251230 - Julian) 空白項目的圓餅顏色使用特定顏色
    return getCssVariable(PIE_CHART_EMPTY_COLOR_PROPERTY);
  } else {
    // Info: (20251230 - Julian) 用模數運算取得顏色索引，確保不會超出陣列範圍
    const targetIndex = index % PIE_CHART_FILL_COLORS_PROPERTIES.length;
    // Info: (20251230 - Julian) 根據項目的數量，取出對應的顏色
    return getCssVariable(PIE_CHART_FILL_COLORS_PROPERTIES[targetIndex]);
  }
}
