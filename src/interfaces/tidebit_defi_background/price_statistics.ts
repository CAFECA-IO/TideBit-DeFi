export interface IPriceStatistics {
  fiveMin: {low: number; high: number; now: string}; // now = [(now - low) / (high - low)] x 100
  sixtyMin: {low: number; high: number; now: string};
  oneDay: {low: number; high: number; now: string};
}
