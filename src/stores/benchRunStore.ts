import { defineStore } from 'pinia'
import type { BenchRun } from '../utils/data'

export const useBenchRunStore = defineStore('benchRun', {
  state: () => ({
    benchRuns: [] as BenchRun[],
  }),

  actions: {
    addBenchRun(benchRun: BenchRun) {
      this.benchRuns.push(benchRun)
    },
    findBenchRunsOnCommits(commitIds: string[]): BenchRun[] {
      return this.benchRuns.filter((b) => commitIds.includes(b.headCommit.id))
    },
  },
})
