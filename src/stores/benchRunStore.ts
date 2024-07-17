import { defineStore } from 'pinia'
import { type BenchRun } from '../data'

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

    findBenchRunById(benchRunId: string): BenchRun | null {
      const found = this.benchRuns.find((benchRun) => benchRun.id === benchRunId)
      if (found) {
        return found
      } else {
        return null
      }
    },
  },
})
