import SafeMath from '../lib/safe_math';

// Info: Test for positive numbers (20231116 - Shirley)
test('Check if positive integer is a number', () => {
  expect(SafeMath.isNumber(123)).toBe(true);
});

test('Check if positive decimal is a number', () => {
  expect(SafeMath.isNumber(123.45)).toBe(true);
});

// Info: Test for negative numbers (20231116 - Shirley)
test('Check if negative integer is a number', () => {
  expect(SafeMath.isNumber(-123)).toBe(true);
});

test('Check if negative decimal is a number', () => {
  expect(SafeMath.isNumber(-123.45)).toBe(true);
});

// Info: Test for zero (20231116 - Shirley)
test('Check if zero is a number', () => {
  expect(SafeMath.isNumber(0)).toBe(true);
});

// Info: Test for non-numeric strings (20231116 - Shirley)
test('Check if alphabetic string is not a number', () => {
  expect(SafeMath.isNumber('abc')).toBe(false);
});

test('Check if alphanumeric string is not a number', () => {
  expect(SafeMath.isNumber('123abc')).toBe(false);
});

// Info: Test for special cases (20231116 - Shirley)
test('Check if empty string is not a number', () => {
  expect(SafeMath.isNumber('')).toBe(false);
});

test('Check if string with spaces is not a number', () => {
  expect(SafeMath.isNumber(' ')).toBe(false);
});

// Info: Test for strings that represent numbers (20231116 - Shirley)
test('Check if string representing positive number is a number', () => {
  expect(SafeMath.isNumber('123')).toBe(true);
});

test('Check if string representing negative number is a number', () => {
  expect(SafeMath.isNumber('-123')).toBe(true);
});

test('Check if string representing decimal number is a number', () => {
  expect(SafeMath.isNumber('123.45')).toBe(true);
});

test('Check if string representing negative decimal number is a number', () => {
  expect(SafeMath.isNumber('-123.45')).toBe(true);
});
