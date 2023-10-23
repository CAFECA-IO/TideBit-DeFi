import {roundToDecimalPlaces} from '../lib/common';
import {RoundCondition} from '../interfaces/tidebit_defi_background/round_condition';

test('Round 0.02 number with SHRINK condition to 2 decimal places', () => {
  expect(roundToDecimalPlaces(0.02, 2, RoundCondition.SHRINK)).toBe(0.02);
});

test('Round 0.02 number with ENLARGE condition to 2 decimal places', () => {
  expect(roundToDecimalPlaces(0.02, 2, RoundCondition.ENLARGE)).toBe(0.03);
});

test('Round 0.5 number with SHRINK condition to 2 decimal places', () => {
  expect(roundToDecimalPlaces(0.5, 2, RoundCondition.SHRINK)).toBe(0.5);
});

test('Round 0.5 number with ENLARGE condition to 2 decimal places', () => {
  expect(roundToDecimalPlaces(0.5, 2, RoundCondition.ENLARGE)).toBe(0.51);
});

test('Round 0.5 number with default condition to 2 decimal places', () => {
  expect(roundToDecimalPlaces(0.5, 2)).toBe(0.51);
});

test('Round positive number with SHRINK condition to 1 decimal places', () => {
  expect(roundToDecimalPlaces(6.618689, 1, RoundCondition.SHRINK)).toBe(6.6);
});

test('Round positive number with ENLARGE condition to 1 decimal places', () => {
  expect(roundToDecimalPlaces(6.618689, 1, RoundCondition.ENLARGE)).toBe(6.7);
});

test('Round negative number with SHRINK condition to 1 decimal places', () => {
  expect(roundToDecimalPlaces(-6.618689, 1, RoundCondition.SHRINK)).toBe(-6.7);
});

test('Round negative number with ENLARGE condition to 1 decimal places', () => {
  expect(roundToDecimalPlaces(-6.618689, 1, RoundCondition.ENLARGE)).toBe(-6.6);
});

test('Round positive number with SHRINK condition to 2 decimal places', () => {
  expect(roundToDecimalPlaces(0.5523, 2, RoundCondition.SHRINK)).toBe(0.55);
});

test('Round positive number with ENLARGE condition to 2 decimal places', () => {
  expect(roundToDecimalPlaces(7.9632, 2, RoundCondition.ENLARGE)).toBe(7.97);
});

test('Round negative number with SHRINK condition to 2 decimal places', () => {
  expect(roundToDecimalPlaces(-2.3354, 2, RoundCondition.SHRINK)).toBe(-2.34);
});

test('Round negative number with ENLARGE condition to 2 decimal places', () => {
  expect(roundToDecimalPlaces(-2.6632, 2, RoundCondition.ENLARGE)).toBe(-2.66);
});

// Info: (20231023 - Shirley) Zero values
test('Round zero to 1 decimal place with SHRINK condition', () => {
  expect(roundToDecimalPlaces(0, 1, RoundCondition.SHRINK)).toBe(0);
});

test('Round zero to 1 decimal place with ENLARGE condition', () => {
  expect(roundToDecimalPlaces(0, 1, RoundCondition.ENLARGE)).toBe(0);
});

test('Round zero-like value (close to EPSILON) to 1 decimal place with SHRINK condition', () => {
  expect(roundToDecimalPlaces(Number.EPSILON, 1, RoundCondition.SHRINK)).toBe(0);
});

test('Round zero-like value (close to EPSILON) to 1 decimal place with ENLARGE condition', () => {
  expect(roundToDecimalPlaces(Number.EPSILON, 1, RoundCondition.ENLARGE)).toBe(0.1);
});

// Info: (20231023 - Shirley) Boundary values
test('Round 0.5 to 0 decimal places with SHRINK condition', () => {
  expect(roundToDecimalPlaces(0.5, 0, RoundCondition.SHRINK)).toBe(0);
});

test('Round -0.5 to 0 decimal places with SHRINK condition', () => {
  expect(roundToDecimalPlaces(-0.5, 0, RoundCondition.SHRINK)).toBe(-1);
});

test('Round -0.5 to 0 decimal places with ENLARGE condition', () => {
  expect(roundToDecimalPlaces(-0.5, 0, RoundCondition.ENLARGE)).toBe(0);
});

// Info: (20231023 - Shirley) No condition given
test('Round 6.618689 to 1 decimal place with no condition', () => {
  expect(roundToDecimalPlaces(6.618689, 1)).toBe(6.7);
});

// Info: (20231023 - Shirley) Large and small numbers
test('Round very large number to 2 decimal places with SHRINK condition', () => {
  expect(roundToDecimalPlaces(123456789.98765, 2, RoundCondition.SHRINK)).toBe(123456789.98);
});

test('Round very large number to 2 decimal places with ENLARGE condition', () => {
  expect(roundToDecimalPlaces(123456789.98765, 2, RoundCondition.ENLARGE)).toBe(123456789.99);
});

test('Round very small number (close to EPSILON) to 5 decimal places with SHRINK condition', () => {
  expect(roundToDecimalPlaces(0.0000012345, 5, RoundCondition.SHRINK)).toBe(0.0);
});

test('Round very small number (close to EPSILON) to 5 decimal places with ENLARGE condition', () => {
  expect(roundToDecimalPlaces(0.0000012345, 5, RoundCondition.ENLARGE)).toBe(0.00001);
});

// Info: (20231023 - Shirley) Maximum and minimum decimal places
test('Round 6.618689 to maximum decimal places with SHRINK condition', () => {
  expect(roundToDecimalPlaces(6.618689, 15, RoundCondition.SHRINK)).toBeCloseTo(6.618689, 15);
});

test('Round 6.618689 to maximum decimal places with ENLARGE condition', () => {
  expect(roundToDecimalPlaces(6.618689, 15, RoundCondition.ENLARGE)).toBeCloseTo(6.618689, 15);
});

test('Round 6.618689 to 0 decimal places with SHRINK condition', () => {
  expect(roundToDecimalPlaces(6.618689, 0, RoundCondition.SHRINK)).toBe(6);
});

test('Round 6.618689 to 0 decimal places with ENLARGE condition', () => {
  expect(roundToDecimalPlaces(6.618689, 0, RoundCondition.ENLARGE)).toBe(7);
});
