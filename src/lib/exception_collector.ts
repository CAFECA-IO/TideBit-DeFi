interface IErrorItem {
  reason: string;
  code: string;
  message: string;
  where: string;
  when: number;
}

interface IException {
  level: number;
  item: IErrorItem;
}

type ISearchProps = 'WHERE' | 'MESSAGE' | 'CODE' | 'EXCEPTION';
export interface ISearchPropsConstant {
  WHERE: ISearchProps;
  MESSAGE: ISearchProps;
  CODE: ISearchProps;
  EXCEPTION: ISearchProps;
}
export const SearchProps: ISearchPropsConstant = {
  WHERE: 'WHERE',
  MESSAGE: 'MESSAGE',
  CODE: 'CODE',
  EXCEPTION: 'EXCEPTION',
};

class ExceptionCollector {
  private exceptions: IException[];

  constructor() {
    this.exceptions = [];
  }

  add(exc: IErrorItem): void {
    const exists = this.exceptions.some(exception => exception.item.code === exc.code);
    if (!exists) {
      const exception = this.setLevel(exc);
      this.exceptions.push(exception);
      this.sort();
    }
  }

  remove(exc: IException[]): void {
    exc.forEach(exceptionToRemove => {
      this.exceptions = this.exceptions.filter(
        exception => !this.areItemsEqual(exception.item, exceptionToRemove.item)
      );
    });
  }

  // Info: report function with callback other function (20231108 - Shirley)
  report(callback: () => void): void {
    callback();
    this.exceptions = [];
  }

  // Info: compare the level of exception and callback (20231108 - Shirley)
  alert(callback: () => void) {
    callback();
  }

  search(props: ISearchProps, from: string): IException[] {
    let result: IException[] = [];
    switch (props) {
      case SearchProps.WHERE:
        result = this.exceptions.filter(e => e.item.where === from);
        break;
      case SearchProps.MESSAGE:
        result = this.exceptions.filter(e => e.item.reason === from);
        break;
      case SearchProps.CODE:
        result = this.exceptions.filter(e => e.item.code === from);
        break;
      case SearchProps.EXCEPTION:
        result = this.exceptions.filter(e => e.item.message === from);
        break;
      default:
        result = [];
    }

    return result;
  }

  /**
   * Info:  (20231108 - Shirley)
    第三位：錯誤級別
    1：致命錯誤
    2：嚴重錯誤
    3：一般錯誤
    4：警告
   */
  setLevel(item: IErrorItem, severity?: string): IException {
    const level = severity ? severity : item.code.charAt(2);
    const exception = {
      level: parseInt(level, 10),
      item: item,
    };

    return exception;
  }

  // Info: sort the exception by level of exception (20231108 - Shirley)
  sort() {
    this.exceptions.sort((a, b) => {
      if (a.level === b.level) {
        return a.item.when - b.item.when; // Secondary sort by timestamp if levels are equal
      }
      return a.level - b.level;
    });
  }

  // Info: return the severest exception, which might not be only one (20231108 - Shirley)
  getSeverest() {
    this.sort();
    const severest = this.exceptions.filter(e => e.level === this.exceptions[0].level);
    return severest;
  }

  getExceptions() {
    return this.exceptions;
  }

  // Info: Utility function for deep object comparison (20231108 - Shirley)
  areItemsEqual(item1: IErrorItem, item2: IErrorItem): boolean {
    return JSON.stringify(item1) === JSON.stringify(item2);
  }
}

const ExceptionCollectorInstance = new ExceptionCollector();
export default ExceptionCollectorInstance;
