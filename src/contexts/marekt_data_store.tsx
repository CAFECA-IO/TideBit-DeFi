import {create} from 'zustand';
import {ICandlestickData} from '../interfaces/tidebit_defi_background/candlestickData';

interface MarketDataStore {
  candlestickChartDataForStore: ICandlestickData[] | null;
  setCandlestickChartDataForStore: (data: ICandlestickData[]) => void;

  bears: number;
  increase: (by: number) => void;
}

export const useMarketData = create<MarketDataStore>()(set => ({
  bears: 0,
  increase: by => set(state => ({bears: state.bears + by})),

  candlestickChartDataForStore: null,
  setCandlestickChartDataForStore: data => set({candlestickChartDataForStore: data}),
}));
