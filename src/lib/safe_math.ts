import BigNumber from 'bignumber.js';

class SafeMath {
  static isNumber(str: string | number) {
    try {
      // Info: 檢查參數是否為 undefined 或 null (20230925 - tzuhan)
      if (str === undefined || str === null) {
        return false;
      }
      // Info:  檢查參數是否是字符串  (20230925 - tzuhan)
      if (typeof str !== 'string' && typeof str !== 'number') {
        return false;
      }

      const numReg = /^(([1-9]\d*)|([0]{1}))(\.\d+)?$/;
      return numReg.test(str.toString());
    } catch (error) {
      // Deprecated: [debug]  (20230925 - tzuhan)
      // eslint-disable-next-line no-console
      console.error('Error in isNumber method:', error);
      return false; // 在異常情況下返回false
    }
  }
  /**
   * check is hex number string
   * @param {string} str
   * @returns {boolean}
   */
  static isHex(str: string): boolean {
    const reg = /^(0x)?[a-fA-F0-9]*$/;
    return reg.test(str);
  }

  /**
   * change string or number to bignumber
   * @param {string | number} input
   * @returns {BigNumber}
   */
  static toBn(input: string | number): BigNumber {
    let bnInput;
    if (typeof input === 'string' && !SafeMath.isNumber(input) && SafeMath.isHex(input)) {
      bnInput = new BigNumber(input, 16);
    } else {
      bnInput = new BigNumber(input);
    }
    return bnInput;
  }

  static toSmallestUnitHex(amount: string | number, decimals: number) {
    const result = new BigNumber(amount).multipliedBy(new BigNumber(10).pow(decimals)).toString(16);
    return result;
  }

  /**
   * a + b
   * @param {string | number} a
   * @param {string | number} b
   * @returns {string}
   */
  static plus(a: string | number, b: string | number): number {
    const bnA = SafeMath.toBn(a);
    const bnB = SafeMath.toBn(b);
    return parseFloat(bnA.plus(bnB).toFixed());
  }

  /**
   * a - b
   * @param {string | number} a
   * @param {string | number} b
   * @returns {string}
   */
  static minus(a: string | number, b: string | number): string {
    const bnA = SafeMath.toBn(a);
    const bnB = SafeMath.toBn(b);
    return bnA.minus(bnB).toFixed();
  }

  /**
   * a * b
   * @param {string | number} a
   * @param {string | number} b
   * @returns {string}
   */
  static mult(a: string | number, b: string | number): string {
    const bnA = SafeMath.toBn(a);
    const bnB = SafeMath.toBn(b);
    return bnA.multipliedBy(bnB).toFixed();
  }

  /**
   * a / b
   * @param {string | number} a
   * @param {string | number} b
   * @returns {string}
   */
  static div(a: string | number, b: string | number): string {
    const bnA = SafeMath.toBn(a);
    const bnB = SafeMath.toBn(b);
    return bnA.dividedBy(bnB).toFixed();
  }

  /**
   * a % b
   * @param {string | number} a
   * @param {string | number} b
   * @returns {string}
   */
  static mod(a: string | number, b: string | number): string {
    const bnA = SafeMath.toBn(a);
    const bnB = SafeMath.toBn(b);
    return bnA.mod(bnB).toFixed();
  }

  /**
   * a == b
   * @param {string | number} a
   * @param {string | number} b
   * @returns {boolean}
   */
  static eq(a: string | number, b: string | number): boolean {
    const bnA = SafeMath.toBn(a);
    const bnB = SafeMath.toBn(b);
    return bnA.eq(bnB);
  }

  /**
   * a > b
   * @param {string | number} a
   * @param {string | number} b
   * @returns {boolean}
   */
  static gt(a: string | number, b: string | number): boolean {
    const bnA = SafeMath.toBn(a);
    const bnB = SafeMath.toBn(b);
    return bnA.gt(bnB);
  }

  /**
   * a >= b
   * @param {string | number} a
   * @param {string | number} b
   * @returns {boolean}
   */
  static gte(a: string | number, b: string | number): boolean {
    const bnA = SafeMath.toBn(a);
    const bnB = SafeMath.toBn(b);
    return bnA.gte(bnB);
  }

  /**
   * a < b
   * @param {string | number} a
   * @param {string | number} b
   * @returns {boolean}
   */
  static lt(a: string | number, b: string | number): boolean {
    const bnA = SafeMath.toBn(a);
    const bnB = SafeMath.toBn(b);
    return bnA.lt(bnB);
  }

  /**
   * a <= b
   * @param {string | number} a
   * @param {string | number} b
   * @returns {boolean}
   */
  static lte(a: string | number, b: string | number): boolean {
    const bnA = SafeMath.toBn(a);
    const bnB = SafeMath.toBn(b);
    return bnA.lte(bnB);
  }

  /**
   * @override
   * according to currency decimal to transform amount to currency unit
   * @method toCurrencyUint
   * @param {string | number} amount
   * @param {number} decimals
   * @returns {string}
   */
  static toCurrencyUint(amount: string | number, decimals: number): string {
    const bnAmount = SafeMath.toBn(amount);
    const bnBase = SafeMath.toBn(10);
    const bnDecimal = bnBase.exponentiatedBy(decimals);
    const currencyUint = bnAmount.dividedBy(bnDecimal).toFixed();
    return currencyUint;
  }

  /**
   * @override
   * according to currency decimal to transform amount to currency unit
   * @method gweiToEth
   * @param {string} amount
   * @returns {string}
   */
  static gweiToEth(amount: string): string {
    const bnAmount = SafeMath.toBn(amount);
    const bnBase = SafeMath.toBn(10);
    const bnDecimal = bnBase.exponentiatedBy(9);
    const currencyUint = bnAmount.dividedBy(bnDecimal).toFixed();
    return currencyUint;
  }

  /**
   * @override
   * according to currency decimal to transform amount to currency unit
   * @method weiToGwei
   * @param {string} amount
   * @returns {string}
   */
  static weiToGwei(amount: string): string {
    const bnAmount = SafeMath.toBn(amount);
    const bnBase = SafeMath.toBn(10);
    const bnDecimal = bnBase.exponentiatedBy(9);
    const currencyUint = bnAmount.dividedBy(bnDecimal).toFixed();
    return currencyUint;
  }

  /**
   * @override
   * @method toSmallestUnit
   * @param {string|number} amount
   * @param {Number} decimals
   * @returns {string}
   */
  static toSmallestUnit(amount: string | number, decimals: number): number {
    const bnAmount = SafeMath.toBn(amount);
    const bnBase = SafeMath.toBn(10);
    const bnDecimal = bnBase.exponentiatedBy(decimals);
    const smallestUint = parseInt(bnAmount.multipliedBy(bnDecimal).toFixed());
    return smallestUint;
  }

  /**
   * @override
   * @method ethToGwei
   * @param {string} amount
   * @returns {string}
   */
  static ethToGwei(amount: string): string {
    const bnAmount = SafeMath.toBn(amount);
    const bnBase = SafeMath.toBn(10);
    const bnDecimal = bnBase.exponentiatedBy(9);
    const smallestUint = bnAmount.multipliedBy(bnDecimal).toFixed();
    return smallestUint;
  }

  /**
   * @override
   * @method gweiToWei
   * @param {string} amount
   * @returns {string}
   */
  static gweiToWei(amount: string): string {
    const bnAmount = SafeMath.toBn(amount);
    const bnBase = SafeMath.toBn(10);
    const bnDecimal = bnBase.exponentiatedBy(9);
    const smallestUint = bnAmount.multipliedBy(bnDecimal).toFixed();
    return smallestUint;
  }

  /**
   * compressedPubKey check number
   * @param {string} x
   * @param {string} y
   * @returns {boolean}
   */
  static compressedPubKeyCheck(x: string, y: string): boolean {
    const bnP = SafeMath.toBn('fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f');

    const bnX = SafeMath.toBn(x);
    const bnY = SafeMath.toBn(y);

    const check = bnX
      .pow(new BigNumber(3))
      .plus(new BigNumber(7))
      .minus(bnY.pow(new BigNumber(2)))
      .mod(bnP);
    return check.isZero();
  }

  /**
   *
   * @param {string} x
   * @returns {string} hex number string
   */
  static toHex(x: string): string {
    const bnX = SafeMath.toBn(x);
    return bnX.toString(16);
  }
}

export default SafeMath;
