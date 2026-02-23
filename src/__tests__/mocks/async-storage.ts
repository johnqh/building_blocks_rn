/**
 * Mock implementation of @react-native-async-storage/async-storage.
 */
import { vi } from 'vitest';

const store: Record<string, string> = {};

const AsyncStorage = {
  getItem: vi.fn(
    async (key: string): Promise<string | null> => store[key] ?? null
  ),
  setItem: vi.fn(async (key: string, value: string): Promise<void> => {
    store[key] = value;
  }),
  removeItem: vi.fn(async (key: string): Promise<void> => {
    delete store[key];
  }),
  clear: vi.fn(async (): Promise<void> => {
    for (const key of Object.keys(store)) {
      delete store[key];
    }
  }),
};

export default AsyncStorage;
