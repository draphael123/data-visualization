import { create } from 'zustand';
import { Dataset, ChartConfig, TransformStep } from '@/lib/types';

interface AppState {
  datasets: Dataset[];
  charts: ChartConfig[];
  activeDatasetId: string | null;
  addDataset: (dataset: Dataset) => void;
  removeDataset: (id: string) => void;
  setActiveDataset: (id: string | null) => void;
  addChart: (chart: ChartConfig) => void;
  removeChart: (id: string) => void;
  updateChart: (id: string, updates: Partial<ChartConfig>) => void;
  updateChartTitle: (id: string, title: string) => void;
}

export const useStore = create<AppState>()((set) => ({
  datasets: [],
  charts: [],
  activeDatasetId: null,
  addDataset: (dataset) =>
    set((state) => ({
      datasets: [...state.datasets, dataset],
      activeDatasetId: state.activeDatasetId || dataset.id,
    })),
  removeDataset: (id) =>
    set((state) => ({
      datasets: state.datasets.filter((d) => d.id !== id),
      charts: state.charts.filter((c) => c.datasetId !== id),
      activeDatasetId: state.activeDatasetId === id ? state.datasets.find((d) => d.id !== id)?.id || null : state.activeDatasetId,
    })),
  setActiveDataset: (id) => set({ activeDatasetId: id }),
  addChart: (chart) => set((state) => ({ charts: [...state.charts, chart] })),
  removeChart: (id) => set((state) => ({ charts: state.charts.filter((c) => c.id !== id) })),
  updateChart: (id, updates) =>
    set((state) => ({
      charts: state.charts.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),
  updateChartTitle: (id, title) =>
    set((state) => ({
      charts: state.charts.map((c) => (c.id === id ? { ...c, title } : c)),
    })),
}));

