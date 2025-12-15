import { useEffect } from 'react';

export function useIdleTimer(timeout: number, onIdle: () => void) {
  // Info: (20251215 - Julian) 自定義 Hook useIdleTimer：用於監測使用者閒置時間，超過指定時間後觸發回調函數

  useEffect(() => {
    // Info: (20251215 - Julian) 設置計時器
    let timer: number;

    // Info: (20251215 - Julian) 重置計時器
    const resetTimer = () => {
      clearTimeout(timer);
      timer = window.setTimeout(onIdle, timeout);
    };

    // Info: (20251215 - Julian) 監聽使用者活動事件：滑鼠移動、按下按鍵、滾動、點擊、觸摸（觸控裝置）
    const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];

    // Info: (20251215 - Julian) 為以上事件添加事件監聽器；ㄋ當以上事件觸發時，重置計時器
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    // Info: (20251215 - Julian) 清理函數：移除事件監聽器並清除計時器
    return () => {
      clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [timeout, onIdle]);
}
