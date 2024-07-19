<script setup lang="ts">
/**
 * This file contains information about all the benchmarks from the cache.
 * It just displays some text about the database.
 */
import { useDataPointStore } from '../stores/dataPointsStore'
import { useLabelStore } from '../stores/labelStore'

const props = defineProps<{
  startDate: Date
  endDate: Date
}>()

const datapointStore = useDataPointStore()
const labelStore = useLabelStore()
const allLabels = Array.from(labelStore.getAllLabels())

const benchStats: Map<string, Statistics> = new Map()
for (let i = 0; i < allLabels.length; i++) {
  const label = allLabels[i]
  benchStats.set(label, fetchStats(label))
}

// Suspicious benchmarks are those whose datapoints violate
// six sigma.
const suspiciousBenchmarks: Array<string> = []
for (const [label, stats] of benchStats) {
  if (stats.sixSigmaViolated) {
    suspiciousBenchmarks.push(label)
  }
}

interface Statistics {
  mean: number
  stdDev: number
  sixSigmaViolated: boolean
}

function fetchStats(label: string): Statistics {
  const dps = datapointStore.findDatapoints({
    startDate: props.startDate,
    endDate: props.endDate,
    label: label,
    branch: 'develop',
  })
  const scores = dps.map((dp) => dp.score)
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length
  const stdDev = Math.sqrt(
    scores.map((score) => Math.pow(score - mean, 2)).reduce((a, b) => a + b, 0) / scores.length,
  )
  const someScoreViolatesSixSigma = scores.some((score) => Math.abs(score - mean) > 3.5 * stdDev)
  return {
    mean: mean,
    stdDev: stdDev,
    sixSigmaViolated: someScoreViolatesSixSigma,
  }
}

function getStats(label: string): Statistics {
  return benchStats.get(label)!
}
</script>

<template>
  <v-container>
    <h2>Statistics of benchmarks</h2>
    <h3>Gathered for data from {{ startDate }} to {{ endDate }}</h3>
    <h4>List of suspicious benchmarks that violate six sigma</h4>
    <v-list>
      <v-list-item v-for="label in suspiciousBenchmarks">
        <v-list-item-title>{{ label }}</v-list-item-title>
        <v-list-item-subtitle> Mean: {{ getStats(label).mean }} </v-list-item-subtitle>
        <v-list-item-subtitle> StdDev: {{ getStats(label).stdDev }} </v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-container>
</template>
