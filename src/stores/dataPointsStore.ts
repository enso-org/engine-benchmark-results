import { defineStore } from 'pinia'
import type { BenchDataPoint } from '../utils/data'

export const useDataPointStore = defineStore('dataPoint', {
  state: () => ({
    dataPoints: [] as BenchDataPoint[],
    byLabels: new Map() as Map<string, BenchDataPoint[]>,
  }),

  actions: {
    addDataPoint(dataPoint: BenchDataPoint) {
      console.assert(!this.containsDatapoint(dataPoint))
      this.dataPoints.push(dataPoint)
      if (this.byLabels.has(dataPoint.label)) {
        this.byLabels.get(dataPoint.label)!.push(dataPoint)
      } else {
        this.byLabels.set(dataPoint.label, [dataPoint])
      }
    },

    findDataPointsOnBenchRun(benchRunId: string): BenchDataPoint[] {
      return this.dataPoints.filter((dp) => dp.benchRun.id === benchRunId)
    },

    findDatapoints(options: {
      startDate?: Date
      endDate?: Date
      label?: string
      branch?: string
    }): BenchDataPoint[] {
      if (options.label) {
        console.assert(this.byLabels.has(options.label))
        const dpForLabel = this.byLabels.get(options.label)!
        return dpForLabel.filter((dp) => {
          if (options.startDate && dp.benchRun.headCommit.timestamp < options.startDate) {
            return false
          }
          if (options.endDate && dp.benchRun.headCommit.timestamp > options.endDate) {
            return false
          }
          if (options.branch && dp.benchRun.branch !== options.branch) {
            return false
          }
          return true
        })
      }
      return this.dataPoints.filter((dp) => {
        if (options.startDate && dp.benchRun.headCommit.timestamp < options.startDate) {
          return false
        }
        if (options.endDate && dp.benchRun.headCommit.timestamp > options.endDate) {
          return false
        }
        if (options.label && dp.label !== options.label) {
          return false
        }
        if (options.branch && dp.benchRun.branch !== options.branch) {
          return false
        }
        return true
      })
    },

    containsDatapoint(dataPoint: BenchDataPoint): boolean {
      return this.dataPoints.includes(dataPoint)
    },
  },
})
