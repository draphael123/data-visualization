import { create } from 'zustand';
import { Dataset, ChartConfig, TransformStep } from '@/lib/types';

interface Project {
  id: string;
  name: string;
  datasets: Dataset[];
  charts: ChartConfig[];
  activeDatasetId: string | null;
  createdAt: number;
  updatedAt: number;
}

interface AppState {
  datasets: Dataset[];
  charts: ChartConfig[];
  activeDatasetId: string | null;
  projects: Project[];
  activeProjectId: string | null;
  addDataset: (dataset: Dataset) => void;
  removeDataset: (id: string) => void;
  setActiveDataset: (id: string | null) => void;
  addChart: (chart: ChartConfig) => void;
  removeChart: (id: string) => void;
  updateChart: (id: string, updates: Partial<ChartConfig>) => void;
  updateChartTitle: (id: string, title: string) => void;
  saveProject: (name: string) => string;
  loadProject: (projectId: string) => void;
  deleteProject: (projectId: string) => void;
  clearCurrentProject: () => void;
}

// Custom storage handler with error handling
const storage = {
  getItem: (name: string): string | null => {
    try {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem(name);
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      if (typeof window === 'undefined') return;
      // Limit storage size (approximately 5MB)
      if (value.length > 5 * 1024 * 1024) {
        console.warn('Storage quota exceeded. Project data is too large.');
        return;
      }
      localStorage.setItem(name, value);
    } catch (error) {
      console.warn('Error writing to localStorage:', error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('Storage quota exceeded. Consider deleting old projects.');
      }
    }
  },
  removeItem: (name: string): void => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(name);
    } catch (error) {
      console.warn('Error removing from localStorage:', error);
    }
  },
};

// Load projects from localStorage on initialization
const loadProjects = (): Project[] => {
  try {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('vizdrop-projects');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Error loading projects:', error);
  }
  return [];
};

// Save projects to localStorage
const saveProjects = (projects: Project[]): void => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem('vizdrop-projects', JSON.stringify(projects));
  } catch (error) {
    console.warn('Error saving projects:', error);
  }
};

export const useStore = create<AppState>((set, get) => ({
  datasets: [],
  charts: [],
  activeDatasetId: null,
  projects: typeof window !== 'undefined' ? loadProjects() : [],
  activeProjectId: null,
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
  saveProject: (name: string) => {
    const state = get();
    const projectId = `project-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    const project: Project = {
      id: projectId,
      name,
      datasets: state.datasets,
      charts: state.charts,
      activeDatasetId: state.activeDatasetId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const updatedProjects = [...state.projects, project];
    set({ projects: updatedProjects, activeProjectId: projectId });
    saveProjects(updatedProjects);
    return projectId;
  },
  loadProject: (projectId: string) => {
    const state = get();
    const project = state.projects.find((p) => p.id === projectId);
    if (project) {
      set({
        datasets: project.datasets,
        charts: project.charts,
        activeDatasetId: project.activeDatasetId,
        activeProjectId: projectId,
      });
    }
  },
  deleteProject: (projectId: string) => {
    const state = get();
    const updatedProjects = state.projects.filter((p) => p.id !== projectId);
    set({
      projects: updatedProjects,
      activeProjectId: state.activeProjectId === projectId ? null : state.activeProjectId,
    });
    saveProjects(updatedProjects);
  },
  clearCurrentProject: () => {
    set({
      datasets: [],
      charts: [],
      activeDatasetId: null,
      activeProjectId: null,
    });
  },
}));
