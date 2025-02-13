import { defineStore } from 'pinia'

/**
 * Keeps track of the files from the `cache` directory that
 * were already processed.
 */
export const useCacheFileStore = defineStore('cacheFiles', {
  state: () => ({
    cachedFiles: new Set<string>(),
  }),

  actions: {
    markFileAsProcessed(filePath: string) {
      this.cachedFiles.add(filePath)
    },

    wasFileProcessed(filePath: string): boolean {
      return this.cachedFiles.has(filePath)
    },
  },
})
