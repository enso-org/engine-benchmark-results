import { defineStore } from 'pinia'
import type { BenchDataPoint } from '../utils/data'

export const useDataPointStore = defineStore('dataPoint', {
  state: () => ({
    dataPoints: [] as BenchDataPoint[],
  }),

  actions: {
    addDataPoint(dataPoint: BenchDataPoint) {
      this.dataPoints.push(dataPoint)
    },

    findDataPointsOnBenchRun(benchRunId: string): BenchDataPoint[] {
      return this.dataPoints.filter((dp) => dp.benchRun.id === benchRunId)
    },

    findDataPointsByLabel(label: string, start: Date, end: Date = new Date()) {
      return this.dataPoints.filter(
        (dp) =>
          dp.label === label &&
          dp.benchRun.headCommit.timestamp >= start &&
          dp.benchRun.headCommit.timestamp <= end,
      )
    },
  },
})
