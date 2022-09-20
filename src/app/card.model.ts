export interface Card {
  id: number;
  value: string;
  selected: boolean;
  matched: boolean;
}

export const CardValues = [
  'angular',
  'd3',
  'jenkins',
  'postcss',
  'react',
  'redux',
  'sass',
  'ts',
  'webpack'
];

export const CardNumberValues = [4, 6, 12, 16];

export interface BestScore {
  cardNumber: number;
  bestScore: number;
}

export const MAX_BEST_SCORE = 100;
