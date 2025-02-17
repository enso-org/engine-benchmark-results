import { defineStore } from 'pinia'
import { BenchDataPoint, dataPointHash } from '../utils/data'

export const useDataPointStore = defineStore('dataPoint', {
  state: () => ({
    // Storing dataPoint with their hashes as keys
    dataPoints: new Map<string, BenchDataPoint>(),
    byLabels: new Map<string, BenchDataPoint[]>(),
  }),

  actions: {
    addDataPoint(dataPoint: BenchDataPoint) {
      this.dataPoints.set(dataPointHash(dataPoint), dataPoint)
      if (this.byLabels.has(dataPoint.label)) {
        this.byLabels.get(dataPoint.label)!.push(dataPoint)
      } else {
        this.byLabels.set(dataPoint.label, [dataPoint])
      }
    },

    findDataPointsOnBenchRun(benchRunId: string): BenchDataPoint[] {
      return Array.from(this.dataPoints.values()).filter((dp) => dp.benchRun.id === benchRunId)
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
      return Array.from(this.dataPoints.values()).filter((dp) => {
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
      return this.dataPoints.has(dataPointHash(dataPoint))
    },
  },
})
