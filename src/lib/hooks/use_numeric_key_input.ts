import { useCallback } from 'react';
import { KEYBOARD_EVENT_CODE } from '@/constants/keyboard_event_code';

interface IUseNumericKeyInputProps {
  value: string;
  onChange: (value: string) => void;
}

// Info: (20251223 - Julian) 處理在中文輸入法下，填入數字的情況
export function useNumericKeyInput({ value, onChange }: IUseNumericKeyInputProps) {
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      // Info: (20251223 - Julian)  忽略 Ctrl/Cmd + V（貼上）
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'v') {
        return;
      }

      // Info: (20251223 - Julian) 忽略預設行為: Tab, Backspace, Delete, ArrowLeft, ArrowRight
      if (
        event.code === KEYBOARD_EVENT_CODE.TAB ||
        event.code === KEYBOARD_EVENT_CODE.BACKSPACE ||
        event.code === KEYBOARD_EVENT_CODE.DELETE ||
        event.code === KEYBOARD_EVENT_CODE.ARROW_LEFT ||
        event.code === KEYBOARD_EVENT_CODE.ARROW_RIGHT
      ) {
        // console.log('Ignore!', event.code);
        return;
      }

      // Info: (20251223 - Julian) 取得目前顯示值
      const input = event.currentTarget;
      // Info: (20251223 - Julian) 取得目前游標位置
      const cursorPos = input.selectionStart ?? value.length;

      // Info: (20251223 - Julian) 要插入的字串
      let insert = '';

      // Info: (20251223 - Julian) 數字鍵正規表達式：digit0 ~ digit9, numpad0 ~ numpad9
      const digitRegex = /^(Digit|Numpad)[0-9]$/;

      // Info: (20251223 - Julian) 如果按下的是數字鍵
      if (digitRegex.test(event.code)) {
        insert = event.code.replace(/\D/g, '');
      } else if (
        (event.key === '.' || event.code === KEYBOARD_EVENT_CODE.PERIOD) &&
        value.includes('.')
      ) {
        insert = '.';
      }

      // Info: (20251223 - Julian) 如果沒有要插入的字串，則直接返回
      if (!insert) return;

      // Info: (20251223 - Julian) 阻止預設事件
      event.preventDefault();

      // Info: (20251223 - Julian) 組合新的值
      const nextValue = value.slice(0, cursorPos) + insert + value.slice(cursorPos);

      // Info: (20251223 - Julian) 更新值
      onChange(nextValue);
      // console.log('Press!', event.code);
    },
    [value, onChange]
  );

  return { onKeyDown };
}
