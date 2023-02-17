/**
 *
 * @param timestamp is in seconds
 * @returns string array of [date, time], for example: ['2023-02-10', '10:00:00']
 */
export const timestampToString = (timestamp: number) => {
  if (timestamp === 0) return ['-', '-'];

  const date = new Date(timestamp * 1000);
  // const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');

  const dateString = `${year}-${month}-${day}`;
  const timeString = `${hour}:${minute}:${second}`;

  return [dateString, timeString];
};

/**
 *
 * @param address to be truncated
 * @returns '0x1234...12345'
 */
export const accountTruncate = (text: string) => {
  return text?.substring(0, 6) + '...' + text?.substring(text.length - 5);
};

/**
 *
 * @param milleseconds
 * @returns
 */
export const wait = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

interface IRoomOfLocker {
  [key: string]: boolean;
}

type ILocker = [() => boolean, () => boolean, IRoomOfLocker];

const room: IRoomOfLocker = {'common.Example': false};

export const locker = (id: string): ILocker => {
  // let locked = false;

  const lock = () => {
    if (room[id]) {
      // room[id] === true 代表已經上鎖，某 function 正在執行中；
      // 故 `lock` 回傳 false，代表不能執行某 function
      return false;
    } else {
      // room[id] === false 代表沒有上鎖，代表該 function 可以執行；
      // 故鎖上房門並讓 `lock` 回傳 true， 代表可以執行某 function
      room[id] = true;
      // locked = true;
      return true;
    }
  };

  const unlock = () => {
    // room[id] 代表該 function 已經執行完畢，可以解鎖房門
    if (room[id]) {
      room[id] = false;
      // locked = false;
      return true;
    } else {
      // 重複解鎖，代表流程有問題，故拋出錯誤
      throw new Error(
        'Something is wrong with the procedure. Unlocking when not locked. (流程有問題)'
      );
    }
  };

  return [lock, unlock, room];
};
