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
  },
})
