import {roundToDecimalPlaces} from '../lib/common';
import {RoundCondition} from '../interfaces/tidebit_defi_background/round_condition';

test('Round positive number with SHRINK condition', () => {
  expect(roundToDecimalPlaces(6.688689, 1, RoundCondition.SHRINK)).toBe(6.6);
});

test('Round positive number with ENLARGE condition', () => {
  expect(roundToDecimalPlaces(6.688689, 1, RoundCondition.ENLARGE)).toBe(6.7);
});

test('Round negative number with SHRINK condition', () => {
  expect(roundToDecimalPlaces(-6.688689, 1, RoundCondition.SHRINK)).toBe(-6.7);
});

test('Round negative number with ENLARGE condition', () => {
  expect(roundToDecimalPlaces(-6.688689, 1, RoundCondition.ENLARGE)).toBe(-6.6);
});
