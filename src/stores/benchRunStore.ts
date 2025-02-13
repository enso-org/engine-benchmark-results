import { defineStore } from 'pinia'
import type { BenchRun } from '../utils/data'

export const useBenchRunStore = defineStore('benchRun', {
  state: () => ({
    benchRuns: new Map<string, BenchRun>(),
  }),

  actions: {
    addBenchRun(benchRun: BenchRun) {
      this.benchRuns.set(benchRun.id, benchRun)
    },

    findBenchRunsOnCommits(commitIds: string[]): BenchRun[] {
      const filterFunc = (b: BenchRun) => commitIds.includes(b.headCommit.id)
      return Array.from(this.benchRuns.values()).filter(filterFunc)
    },

    findBenchRunById(benchRunId: string): BenchRun | null {
      const found = this.benchRuns.get(benchRunId)
      if (found !== undefined) {
        return found
      } else {
        return null
      }
    },
  },
})

export type BenchRunStore = ReturnType<typeof useBenchRunStore>
